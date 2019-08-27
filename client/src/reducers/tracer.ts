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

export type GroupMapData = {
    [reference: string]: GroupData
}

type State = {
    fetching: boolean
    available: boolean
    index: number
    steps: schema.Step[]
    outputs: string[]
    stackData: StackData
    heapsData: HeapData[]
    groupMapsData: GroupMapData[]
    error: string
}

type Action =
    | {
          type: 'tracer/trace'
          payload?: {
              steps: schema.Step[]
              outputs: string[]
              stackData: StackData
              heapsData: HeapData[]
              groupMapsData: GroupMapData[]
          }
          error?: string
      }
    | { type: 'tracer/setIndex'; payload: { index: number } }

const initialState: State = {
    fetching: false,
    available: false,
    index: 0,
    steps: [],
    outputs: [],
    stackData: undefined,
    heapsData: [],
    groupMapsData: [],
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

const buildOutputs = (steps: schema.Step[]) => {
    const outputs: string[] = []
    steps.forEach((step, i) => {
        const previousOutput = i !== 0 ? outputs[i - 1] : ''
        const threw =
            step.threw && step.threw.exception
                ? step.threw.exception.traceback.join('')
                : step.threw && step.threw.cause
                ? step.threw.cause
                : ''
        const prints = step.prints ? step.prints.join('') : ''
        outputs.push(`${previousOutput}${threw}${prints}`)
    })
    return outputs
}

const buildStackData = (steps: schema.Step[]) => {
    const stackData: StackData = { root: { range: [0, 0], children: [] }, depth: 0 }
    const scopeDataPath = [stackData.root]
    steps.forEach((step, i) => {
        stackData.depth = Math.max(stackData.depth, scopeDataPath.length)
        scopeDataPath.forEach(scope => (scope.range[1] = i))
        if (step.threw) {
            const name = step.threw.exception ? step.threw.exception.type : step.threw.cause
            const threwScopeData: ScopeData = { name, range: [i, i], children: [{ range: [i, i] }] }
            stackData.root.children.push(threwScopeData)
            stackData.root.range[1] = i
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
            const lastLeafData = parentScopeData.children[parentScopeData.children.length - 1]
            lastLeafData.range[1] = i
            if (step.snapshot.type === 'return') scopeDataPath.pop()
        }
    })
    return stackData
}

const buildHeapsData = (steps: schema.Step[]) => {
    const heapsData: HeapData[] = []
    steps.forEach((step, i) => {
        if (!step.snapshot) return heapsData.push(heapsData[i - 1] || {})
        const heapData: HeapData = {}
        heapsData.push(heapData)
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
    return heapsData
}

const expandGroupData = (objData: ObjData, parentObjData: ObjData, localDepth: number, groupData: GroupData) => {
    groupData.members.add(objData.reference)
    groupData.depth = Math.max(groupData.depth, localDepth)
    groupData.type =
        groupData.members.size === 1
            ? 'node'
            : groupData.members.size <= groupData.depth && !groupData.hasNonParentFwdBackCrossCycleEdge
            ? 'list'
            : !groupData.hasNonParentFwdBackCrossCycleEdge
            ? 'tree'
            : 'unknown'
    objData.members
        .filter(member => typeof member.value === 'object' && member.value.languageType === objData.languageType)
        .forEach(member => {
            const value = member.value as ObjData
            if (!groupData.members.has(value.reference))
                if (value === parentObjData) groupData.hasParentEdge = true
                else groupData.hasNonParentFwdBackCrossCycleEdge = true
            else expandGroupData(value, objData, localDepth + 1, groupData)
        })
    return groupData
}

const buildGroupMapsData = (steps: schema.Step[], heapsData: HeapData[]) => {
    const groupMapsData: GroupMapData[] = []
    steps.forEach((step, i) => {
        if (!step.snapshot) return groupMapsData.push(groupMapsData[i - 1] || {})
        const groupMapData: GroupMapData = {}
        groupMapsData.push(groupMapData)
        const heapData = heapsData[i]
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
            if (groupMapData[reference]) return
            const data = expandGroupData(heapData[reference], undefined, 1, {
                base: reference,
                depth: 0,
                members: new Set(),
                hasParentEdge: false,
                hasNonParentFwdBackCrossCycleEdge: false,
                type: 'unknown'
            })
            data.members.forEach(reference => (groupMapData[reference] = data))
        })
    })
    return groupMapsData
}

const trace = (): AsyncAction => async (dispatch, getState) => {
    dispatch({ type: 'tracer/trace' })
    try {
        const { program } = getState()
        const result = (await serverApi.post<schema.Result>('/trace', {
            language: program.language,
            source: program.source ? program.source.join('\n') : '',
            input: program.input ? program.input.join('\n') : ''
        })).data
        const steps = result.steps
        const outputs = buildOutputs(steps)
        const stackData = buildStackData(steps)
        const heapsData = buildHeapsData(steps)
        const groupMapsData = buildGroupMapsData(steps, heapsData)
        dispatch({ type: 'tracer/trace', payload: { steps, outputs, stackData, heapsData, groupMapsData } })
    } catch (error) {
        dispatch({ type: 'tracer/trace', error: error.response ? error.response.data : error.toString() })
    }
}

const setIndex = (index: number): AsyncAction => async (dispatch, getState) => {
    const { tracer } = getState()
    dispatch({ type: 'tracer/setIndex', payload: { index: Math.max(0, Math.min(index, tracer.steps.length - 1)) } })
}

export const actions = { trace, setIndex }
