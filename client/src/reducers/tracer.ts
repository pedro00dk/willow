import { Reducer } from 'redux'
import * as protocol from '../protobuf/protocol'
import { serverApi } from '../server'
import { AsyncAction } from './Store'

export type Scope = {
    readonly name: string
    readonly steps: { from: number; to: number }
    readonly children: Scope[]
}

export type Stack = {
    readonly root: Scope
}

export type Obj = {
    reference: string
    type: protocol.Obj.Type
    languageType: string
    userDefined: boolean
    members: { key: boolean | number | string | Obj; value: boolean | number | string | Obj }[]
}

export type Heap = {
    [reference: string]: Obj
}

type State = {
    readonly fetching: boolean
    readonly available: boolean
    readonly index: number
    readonly steps: protocol.IStep[]
    readonly output: string[]
    readonly lines: { [line: number]: number[] }
    readonly stack: Stack
    readonly heaps: Heap[]
    readonly error: string
}

type Action =
    | {
          type: 'tracer/trace'
          payload?: { steps: protocol.IStep[]; output: string[]; lines: State['lines']; stack: Stack; heaps: Heap[] }
          error?: string
      }
    | { type: 'tracer/setIndex'; payload: { index: number } }

const initialState: State = {
    fetching: false,
    available: false,
    index: 0,
    steps: [],
    output: [],
    lines: {},
    stack: undefined,
    heaps: [],
    error: undefined
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'tracer/trace':
            if (!!action.payload) return { ...state, fetching: false, available: true, ...action.payload }
            if (!!action.error) return { ...state, fetching: false, error: action.error }
            return { ...initialState, fetching: true }
        case 'tracer/setIndex':
            return { ...state, ...action.payload }
    }
    return state
}

const buildStack = (steps: protocol.IStep[]) => {
    const root: Scope = { name: undefined, steps: { from: 0, to: 0 }, children: [] }
    const treePath = [root]
    steps.forEach((step, i) => {
        const snapshot = step.snapshot
        const lastScope = treePath[treePath.length - 1]
        if (!snapshot) {
            const name = !!step.threw.exception ? step.threw.exception.type : step.threw.cause
            const threwSyntheticScope: Scope = {
                name,
                steps: { from: i, to: i },
                children: [{ name: undefined, steps: { from: i, to: i }, children: [] }]
            }
            root.children.push(threwSyntheticScope)
            root.steps.to = i
            return
        } else if (snapshot.type === protocol.Snapshot.Type.CALL) {
            const snapshotStackLastScope = snapshot.stack[snapshot.stack.length - 1]
            const newScope: Scope = { name: snapshotStackLastScope.name, steps: { from: i, to: i }, children: [] }
            const leaf: Scope = { name: undefined, steps: { from: i, to: i }, children: [] }
            newScope.children.push(leaf)
            lastScope.children.push(newScope)
            treePath.forEach(scope => (scope.steps.to = i))
            treePath.push(newScope)
        } else {
            // creates a new leaf if the current scope does not have an ending leaf child (it happens after a RETURN)
            const shallCreateLeaf = lastScope.children[lastScope.children.length - 1].children.length > 0
            if (shallCreateLeaf) lastScope.children.push({ name: undefined, steps: { from: i, to: i }, children: [] })
            //
            const leaf = lastScope.children[lastScope.children.length - 1]
            leaf.steps.to = i
            treePath.forEach(scope => (scope.steps.to = i))
            if (snapshot.type === protocol.Snapshot.Type.RETURN) treePath.pop()
        }
    })
    const stack: Stack = { root }
    return stack
}

const buildHeaps = (steps: protocol.IStep[]) => {
    const heaps: Heap[] = []
    steps.forEach((step, i) => {
        if (!step.snapshot) return heaps.push(!!heaps[i - 1] ? heaps[i - 1] : {})
        const heap: Heap = {}
        heaps.push(heap)
        Object.entries(step.snapshot.heap).forEach(([reference, snapshotHeapObj]) => {
            heap[reference] = {
                reference,
                type: snapshotHeapObj.type,
                languageType: snapshotHeapObj.languageType,
                userDefined: snapshotHeapObj.userDefined,
                members: []
            }
        })
        Object.entries(heap).forEach(([reference, heapObj]) => {
            const obj = step.snapshot.heap[reference]
            heapObj.members = obj.members.map(member => {
                const key =
                    member.key.reference != undefined
                        ? heap[member.key.reference]
                        : Object.values(member.key).filter(value => value != undefined)[0]
                const value =
                    member.value.reference != undefined
                        ? heap[member.value.reference]
                        : Object.values(member.value).filter(value => value != undefined)[0]
                return { key, value }
            })
        })
    })
    return heaps
}

const trace = (): AsyncAction => async (dispatch, getState) => {
    dispatch({ type: 'tracer/trace' })
    try {
        const { code, input, language } = getState()
        const result = (await serverApi.post<protocol.IResult>('/tracer/trace', {
            language: language.languages[language.selected],
            source: code.join('\n'),
            input: input.join('\n')
        })).data

        const steps = result.steps
        const output: string[] = []
        const lines: State['lines'] = []
        result.steps.forEach((step, i) => {
            const snapshot = step.snapshot
            const previousSnapshot = i !== 0 ? steps[i - 1].snapshot : undefined

            const currentOutput = i !== 0 ? output[i - 1] : ''
            const codePrints = step.prints.join('')
            const codeThrew =
                !!snapshot &&
                !!previousSnapshot &&
                snapshot.finish &&
                previousSnapshot.type === protocol.Snapshot.Type.EXCEPTION
                    ? previousSnapshot.exception.traceback.join('')
                    : ''
            const tracerThrew = !!step.threw
                ? !!step.threw.exception
                    ? step.threw.exception.traceback.join('')
                    : step.threw.cause
                : ''

            output[i] = `${currentOutput}${codePrints}${codeThrew}${tracerThrew}`

            if (!snapshot) return
            const line = snapshot.stack[snapshot.stack.length - 1].line
            if (!lines[line]) lines[line] = []
            lines[line].push(i)
        })
        const stack = buildStack(steps)
        const heaps = buildHeaps(steps)
        dispatch({ type: 'tracer/trace', payload: { steps, output, lines, stack, heaps } })
    } catch (error) {
        dispatch({ type: 'tracer/trace', error: !!error.response ? error.response.data : error.toString() })
    }
}

const setIndex = (index: number): AsyncAction => async (dispatch, getState) => {
    const { tracer } = getState()
    dispatch({ type: 'tracer/setIndex', payload: { index: Math.max(0, Math.min(index, tracer.steps.length - 1)) } })
}

export const actions = { trace, setIndex }
