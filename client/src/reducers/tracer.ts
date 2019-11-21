import * as schema from '../schema/schema'
import { serverApi } from '../server'
import { DefaultAsyncAction } from './Store'

export type StackData = {
    root: ScopeData
    depth: number
}

export type ScopeData = {
    name?: string
    children?: ScopeData[]
    range: [number, number]
}

export type HeapData = {
    [id: string]: ObjData
}

export type ObjData = {
    id: string
    type: schema.Obj['type']
    languageType: string
    userDefined: boolean
    members: { key: number | string | ObjData; value: number | string | ObjData }[]
    objMembers: number
}

export type GroupData = {
    [id: string]: StructureData
}

export type StructureData = {
    base: string
    depth: number
    members: Set<string>
    hasCycleEdge: boolean
    hasParentEdge: boolean
    hasNonParentFwdBackCrossEdge: boolean
    type: 'node' | 'list' | 'tree' | 'unknown'
}

type State = {
    fetching: boolean
    available: boolean
    index?: number
    steps?: schema.Step[]
    outputs?: string[]
    stackData?: StackData
    heapsData?: HeapData[]
    groupsData?: GroupData[]
    error?: string
}

type Action =
    | {
          type: 'tracer/execute'
          payload?: {
              steps: schema.Step[]
              outputs: string[]
              stackData: StackData
              heapsData: HeapData[]
              groupsData: GroupData[]
          }
          error?: string
      }
    | { type: 'tracer/setIndex'; payload: number }

const initialState: State = {
    fetching: false,
    available: false
}

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case 'tracer/execute':
            return action.payload
                ? { ...state, fetching: false, available: true, index: 0, ...action.payload }
                : action.error
                ? { ...initialState, error: action.error }
                : { ...initialState, fetching: true }
        case 'tracer/setIndex':
            return { ...state, index: action.payload }
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
            ([id, obj]) => (heapData[id] = { id, ...obj, members: [], objMembers: 0 })
        )
        Object.values(heapData).forEach(objData => {
            const members = step.snapshot.heap[objData.id].members
            objData.members = members.map(member => ({
                key: typeof member.key !== 'object' ? member.key : heapData[member.key[0]],
                value: typeof member.value !== 'object' ? member.value : heapData[member.value[0]]
            }))
            objData.objMembers = objData.members.reduce(
                (acc, member) =>
                    acc + Number(typeof member.key === 'object') + Number(typeof member.value === 'object'),
                0
            )
        })
    })
    return heapsData
}

const expandGroupData = (objData: ObjData, parentObjData: ObjData, localDepth: number, groupData: StructureData) => {
    groupData.members.add(objData.id)
    groupData.depth = Math.max(groupData.depth, localDepth)
    groupData.type =
        groupData.members.size === 1
            ? 'node'
            : groupData.members.size <= groupData.depth && !groupData.hasNonParentFwdBackCrossEdge
            ? 'list'
            : !groupData.hasNonParentFwdBackCrossEdge
            ? 'tree'
            : 'unknown'
    objData.members
        .filter(member => typeof member.value === 'object' && member.value.languageType === objData.languageType)
        .forEach(member => {
            const value = member.value as ObjData
            if (groupData.members.has(value.id))
                if (value === objData) groupData.hasCycleEdge = true
                else if (value === parentObjData) groupData.hasParentEdge = true
                else groupData.hasNonParentFwdBackCrossEdge = true
            else expandGroupData(value, objData, localDepth + 1, groupData)
        })
    return groupData
}

const buildGroupsData = (steps: schema.Step[], heapsData: HeapData[]) => {
    const groupMapsData: GroupData[] = []
    steps.forEach((step, i) => {
        if (!step.snapshot) return groupMapsData.push(groupMapsData[i - 1] || {})
        const groupMapData: GroupData = {}
        groupMapsData.push(groupMapData)
        const heapData = heapsData[i]
        new Set(
            step.snapshot.stack
                .flatMap(scope =>
                    scope.variables
                        .filter(variable => typeof variable.value === 'object')
                        .map(variable => (variable.value as string[])[0])
                )
                .flatMap(id => [
                    id,
                    ...step.snapshot.heap[id].members
                        .filter(member => typeof member.value === 'object')
                        .map(member => (member.value as string[])[0])
                ])
        ).forEach(id => {
            if (groupMapData[id]) return
            const data = expandGroupData(heapData[id], undefined, 1, {
                base: id,
                depth: 0,
                members: new Set(),
                hasCycleEdge: false,
                hasParentEdge: false,
                hasNonParentFwdBackCrossEdge: false,
                type: 'unknown'
            })
            data.members.forEach(id => (groupMapData[id] = data))
        })
    })
    return groupMapsData
}

const trace = (): DefaultAsyncAction => async (dispatch, getState) => {
    dispatch({ type: 'tracer/execute' })
    try {
        const { language, source, input } = getState()
        const result = (
            await serverApi.post<schema.Result>('/trace', {
                language: language.languages[language.selected],
                source: source.join('\n'),
                input: input.join('\n')
            })
        ).data
        const steps = result.steps
        const outputs = buildOutputs(steps)
        const stackData = buildStackData(steps)
        const heapsData = buildHeapsData(steps)
        const groupsData = buildGroupsData(steps, heapsData)
        dispatch({ type: 'tracer/execute', payload: { steps, outputs, stackData, heapsData, groupsData } })
    } catch (error) {
        dispatch({ type: 'tracer/execute', error: error.response ? error.response.data : error.toString() })
    }
}

const setIndex = (index: number): DefaultAsyncAction => (dispatch, getState) => {
    const { tracer } = getState()
    return dispatch({ type: 'tracer/setIndex', payload: Math.min(Math.max(index, 0), tracer.steps.length - 1) })
}

export const actions = { trace, setIndex }
