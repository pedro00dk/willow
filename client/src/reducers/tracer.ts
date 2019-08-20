import { Reducer } from 'redux'
import * as schema from '../schema/schema'
import { serverApi } from '../server'
import { AsyncAction } from './Store'

export type ScopeData = {
    name?: string
    children?: ScopeData[]
    range: [number, number]
}

export type StackData = {
    root: ScopeData
    depth: number
}

export type ObjData = {
    reference: string
    type: schema.Obj['type']
    languageType: string
    userDefined: boolean
    members: { key: number | string | ObjData; value: number | string | ObjData }[]
}

export type HeapData = {
    [reference: string]: ObjData
}

export type GroupData = {
    base: string
    depth: number
    members: Set<string>
    hasParentEdge: boolean
    hasNonParentFwdBackCrossCycleEdge: boolean
    type: 'node' | 'list' | 'tree' | 'unknown'
}

export type GroupMap = {
    [reference: string]: GroupData
}

type State = {
    fetching: boolean
    available: boolean
    index: number
    steps: schema.Step[]
    output: string[]
    stack: StackData
    heaps: HeapData[]
    groups: GroupMap[]
    error: string
}

type Action =
    | {
          type: 'tracer/trace'
          payload?: { steps: schema.Step[]; output: string[]; stack: StackData; heaps: HeapData[]; groups: GroupMap[] }
          error?: string
      }
    | { type: 'tracer/setIndex'; payload: { index: number } }

const initialState: State = {
    fetching: false,
    available: false,
    index: 0,
    steps: [],
    output: [],
    stack: undefined,
    heaps: [],
    groups: [],
    error: undefined
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'tracer/trace':
            if (action.payload) return { ...state, fetching: false, available: true, ...action.payload }
            if (action.error) return { ...state, fetching: false, error: action.error }
            return { ...initialState, fetching: true }
        case 'tracer/setIndex':
            return { ...state, ...action.payload }
    }
    return state
}

const buildOutput = (steps: schema.Step[]) => {
    const output: string[] = []
    steps.forEach((step, i) => {
        const previousOutput = i !== 0 ? output[i - 1] : ''
        const threw =
            step.threw && step.threw.exception
                ? step.threw.exception.traceback.join('')
                : step.threw && step.threw.cause
                ? step.threw.cause
                : ''
        const prints = step.prints ? step.prints.join('') : ''
        output.push(`${previousOutput}${threw}${prints}`)
    })
    return output
}

const buildStack = (steps: schema.Step[]) => {
    const stack: StackData = { root: { range: [0, 0], children: [] }, depth: 0 }
    const scopeDataPath = [stack.root]
    steps.forEach((step, i) => {
        stack.depth = Math.max(stack.depth, scopeDataPath.length)
        scopeDataPath.forEach(scope => (scope.range[1] = i))
        if (step.threw) {
            const name = step.threw.exception ? step.threw.exception.type : step.threw.cause
            const threwScopeData: ScopeData = { name, range: [i, i], children: [{ range: [i, i] }] }
            stack.root.children.push(threwScopeData)
            stack.root.range[1] = i
            return
        }
        if (!step.snapshot) return
        const parentScopeData = scopeDataPath[scopeDataPath.length - 1]
        if (step.snapshot.type === 'call') {
            const scope = step.snapshot.stack[step.snapshot.stack.length - 1]
            const childScopeData: ScopeData = { name: scope.name, range: [i, i], children: [{ range: [i, i] }] }
            parentScopeData.children.push(childScopeData)
            scopeDataPath.push(childScopeData)
        } else {
            // creates a new leaf if the current scope does not have an ending leaf child (it happens after a RETURN)
            if (
                parentScopeData.children.length === 0 ||
                parentScopeData.children[parentScopeData.children.length - 1].children
            )
                parentScopeData.children.push({ range: [i, i] })
            const leafNode = parentScopeData.children[parentScopeData.children.length - 1]
            leafNode.range[1] = i
            if (step.snapshot.type === 'return') scopeDataPath.pop()
        }
    })
    return stack
}

const buildHeaps = (steps: schema.Step[]) => {
    const heaps: HeapData[] = []
    steps.forEach((step, i) => {
        if (!step.snapshot) return heaps.push(heaps[i - 1] || {})
        const heapData: HeapData = {}
        heaps.push(heapData)
        Object.entries(step.snapshot.heap).forEach(
            ([reference, obj]) => (heapData[reference] = { reference, ...obj, members: [] })
        )
        Object.values(heapData).forEach(objData => {
            const members = step.snapshot.heap[objData.reference].members
            objData.members = members.map(member => ({
                key: typeof member.key !== 'object' ? member.key : heapData[member.key[0]],
                value: typeof member.value !== 'object' ? member.value : heapData[member.value[0]]
            }))
        })
    })
    return heaps
}

const expandGroup = (objNode: ObjData, parentNode: ObjData, localDepth: number, data: GroupData) => {
    data.members.add(objNode.reference)
    data.depth = Math.max(data.depth, localDepth)
    data.type =
        data.members.size === 1
            ? 'node'
            : data.members.size <= data.depth && !data.hasNonParentFwdBackCrossCycleEdge
            ? 'list'
            : !data.hasNonParentFwdBackCrossCycleEdge
            ? 'tree'
            : 'unknown'
    objNode.members
        .filter(member => typeof member.value === 'object' && member.value.languageType === objNode.languageType)
        .forEach(member => {
            const value = member.value as ObjData
            if (!data.members.has(value.reference))
                if (value === parentNode) data.hasParentEdge = true
                else data.hasNonParentFwdBackCrossCycleEdge = true
            else expandGroup(value, objNode, localDepth + 1, data)
        })
    return data
}

const buildGroups = (steps: schema.Step[], heaps: HeapData[]) => {
    const groups: GroupMap[] = []
    steps.forEach((step, i) => {
        if (!step.snapshot) return groups.push(groups[i - 1] || {})
        const group: GroupMap = {}
        groups.push(group)
        const heap = heaps[i]
        new Set(
            step.snapshot.stack
                .flatMap(scope =>
                    scope.variables
                        .filter(variable => typeof variable.value === 'object')
                        .map(variable => (variable.value as string[])[0])
                )
                .flatMap(reference => [
                    reference,
                    ...step.snapshot.heap[reference].members
                        .filter(member => typeof member.value === 'object')
                        .map(member => (member.value as string[])[0])
                ])
        ).forEach(reference => {
            if (group[reference]) return
            const data = expandGroup(heap[reference], undefined, 1, {
                base: reference,
                depth: 0,
                members: new Set(),
                hasParentEdge: false,
                hasNonParentFwdBackCrossCycleEdge: false,
                type: 'unknown'
            })
            data.members.forEach(reference => (group[reference] = data))
        })
    })
    return groups
}

const trace = (): AsyncAction => async (dispatch, getState) => {
    dispatch({ type: 'tracer/trace' })
    try {
        const { program } = getState()
        const result = (await serverApi.post<schema.Result>('/trace', {
            language: program.language,
            source: program.source.join('\n'),
            input: program.input.join('\n')
        })).data
        const steps = result.steps
        const output = buildOutput(steps)
        const stack = buildStack(steps)
        const heaps = buildHeaps(steps)
        const groups = buildGroups(steps, heaps)
        dispatch({ type: 'tracer/trace', payload: { steps, output, stack, heaps, groups } })
    } catch (error) {
        dispatch({ type: 'tracer/trace', error: error.response ? error.response.data : error.toString() })
    }
}

const setIndex = (index: number): AsyncAction => async (dispatch, getState) => {
    const { tracer } = getState()
    dispatch({ type: 'tracer/setIndex', payload: { index: Math.max(0, Math.min(index, tracer.steps.length - 1)) } })
}

export const actions = { trace, setIndex }
