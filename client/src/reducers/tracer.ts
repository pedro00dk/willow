import * as schema from '../schema/schema'
import { serverApi } from '../server'
import { DefaultAsyncAction } from './Store'

export type HeapData = {
    [id: string]: ObjData
}

export type ObjData = {
    id: string
    gType: schema.Obj['gType']
    lType: string
    members: { key: number | string | ObjData; value: number | string | ObjData }[]
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
    hasCrossEdge: boolean
    type: 'node' | 'list' | 'tree' | 'unknown'
}

type State = {
    fetching: boolean
    index?: number
    steps?: schema.Step[]
    heapsData?: HeapData[]
    groupsData?: GroupData[]
    error?: string
}

type Action =
    | {
          type: 'tracer/execute'
          payload?: { steps: schema.Step[]; heapsData: HeapData[]; groupsData: GroupData[] }
          error?: string
      }
    | { type: 'tracer/setIndex'; payload: number }

const initialState: State = {
    fetching: false
}

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case 'tracer/execute':
            return action.payload
                ? { ...state, fetching: false, index: 0, ...action.payload }
                : action.error
                ? { ...initialState, error: action.error }
                : { ...initialState, fetching: true }
        case 'tracer/setIndex':
            return { ...state, index: action.payload }
        default:
            return state
    }
}

const buildHeapsData = (steps: schema.Step[]) => {
    let previous: HeapData = {}
    return steps.map(({ snapshot }) => {
        if (!snapshot) return previous
        const heapData: HeapData = {}
        Object.entries(snapshot.heap)
            .map(([id, obj]) => (heapData[id] = { id, ...obj, members: [] }))
            .forEach(objData => {
                objData.members = snapshot.heap[objData.id].members.map(member => ({
                    key: typeof member.key !== 'object' ? member.key : heapData[member.key[0]],
                    value: typeof member.value !== 'object' ? member.value : heapData[member.value[0]]
                }))
            })
        return (previous = heapData)
    })
}

const buildStructureData = (objData: ObjData, parentObjData: ObjData, depth: number, structureData: StructureData) => {
    structureData.members.add(objData.id)
    structureData.depth = Math.max(structureData.depth, depth)
    structureData.type =
        structureData.members.size === 1
            ? 'node'
            : structureData.members.size === structureData.depth
            ? 'list'
            : !structureData.hasCrossEdge
            ? 'tree'
            : 'unknown'
    objData.members
        .filter(member => typeof member.value === 'object' && member.value?.lType === objData.lType)
        .map(member => member.value as ObjData)
        .forEach(value => {
            if (!structureData.members.has(value.id))
                return buildStructureData(value, objData, depth + 1, structureData)
            structureData.hasCycleEdge = structureData.hasCycleEdge || value === objData
            structureData.hasParentEdge = structureData.hasParentEdge || value === parentObjData
            structureData.hasCrossEdge = structureData.hasCrossEdge || (value !== objData && value !== parentObjData)
        })
    return structureData
}

const buildGroupsData = (steps: schema.Step[], heapsData: HeapData[]) => {
    let previous: GroupData = {}
    return steps.map(({ snapshot }, i) => {
        if (!snapshot) return previous
        const groupData: GroupData = {}
        const heapData = heapsData[i]
        const references = snapshot.stack
            .flatMap(scope => scope.variables)
            .filter(variable => typeof variable.value === 'object')
            .map(variable => (variable.value as string[])[0])
            .map(id => [id, snapshot.heap[id].members] as const)
            .map(([id, members]) => [id, members.filter(member => typeof member.value === 'object')] as const)
            .flatMap(([id, members]) => [id, ...members.map(member => (member.value as string[])[0])])
        new Set(references).forEach(id => {
            if (groupData[id]) return
            const structureData = buildStructureData(heapData[id], undefined, 1, {
                base: id,
                depth: 0,
                members: new Set(),
                hasCycleEdge: false,
                hasParentEdge: false,
                hasCrossEdge: false,
                type: 'unknown'
            })
            structureData.members.forEach(id => (groupData[id] = structureData))
        })
        return (previous = groupData)
    })
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
        const heapsData = buildHeapsData(steps)
        const groupsData = buildGroupsData(steps, heapsData)
        dispatch({ type: 'tracer/execute', payload: { steps, heapsData, groupsData } })
    } catch (error) {
        dispatch({ type: 'tracer/execute', error: error.response ? error.response.data : error.toString() })
    }
}

const setIndex = (index: number): DefaultAsyncAction => async (dispatch, getState) => {
    const tracer = getState().tracer
    if (!tracer.steps) return
    dispatch({ type: 'tracer/setIndex', payload: Math.min(Math.max(index, 0), tracer.steps.length - 1) })
}

const stepIndex = (direction: 'forward' | 'backward', type: 'into' | 'over' | 'out'): DefaultAsyncAction =>
    //
    async (dispatch, getState) => {
        const tracer = getState().tracer
        if (!tracer.steps) return
        const currentSnapshot = tracer.steps[tracer.index].snapshot

        const directionFilter = (index: number) =>
            direction === 'forward' ? index > tracer.index : index < tracer.index
        const typeFilter = (step: schema.Step) =>
            !currentSnapshot || !step.snapshot || type === 'into'
                ? true
                : type === 'over'
                ? step.snapshot.stack.length <= currentSnapshot.stack.length
                : type === 'out'
                ? step.snapshot.stack.length < currentSnapshot.stack.length
                : false

        const indices = tracer.steps
            .map((step, i) => ({ step, i }))
            .filter(({ step, i }) => directionFilter(i) && typeFilter(step))
            .map(({ i }) => i)
        const index = indices[direction === 'forward' ? 0 : indices.length - 1] ?? tracer.index
        return dispatch({ type: 'tracer/setIndex', payload: index })
    }
export const actions = { trace, setIndex, decrementIndex, incrementIndex, stepIndex }
