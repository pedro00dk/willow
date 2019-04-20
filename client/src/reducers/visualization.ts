import { Reducer } from 'redux'
import * as protocol from '../protobuf/protocol'

export type Scope = {
    readonly name: string
    readonly steps: { from: number; to: number }
    readonly children: Scope[]
}

export type Obj = {
    reference: string
    type: protocol.Obj.Type
    languageType: string
    userDefined: boolean
    members: { key: boolean | number | string | Obj; value: boolean | number | string | Obj }[]
}

export type Stack = {
    readonly root: Scope
}

export type Heap = {
    [reference: string]: Obj
}

type State = {
    readonly stack: Stack
    readonly heaps: Heap[]
    readonly objNodes: { [reference: string]: string }
    readonly typeNodes: { [type: string]: string }
}

type Action =
    | { type: 'visualization/load'; payload: { stack: Stack; heaps: Heap[] } }
    | { type: 'visualization/setObjNode'; payload: { reference: string; node: string } }
    | { type: 'visualization/setTypeNode'; payload: { type: string; node: string } }

const initialState: State = {
    stack: undefined,
    heaps: [],
    objNodes: {},
    typeNodes: {}
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'visualization/load':
            return { ...initialState, ...action.payload }
        case 'visualization/setObjNode':
            return {
                ...state,
                objNodes: { ...state.objNodes, [action.payload.reference]: action.payload.node }
            }
        case 'visualization/setTypeNode':
            return {
                ...state,
                typeNodes: { ...state.typeNodes, [action.payload.type]: action.payload.node }
            }
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

const load = (steps: protocol.IStep[]): Action => ({
    type: 'visualization/load',
    payload: { stack: buildStack(steps), heaps: buildHeaps(steps) }
})

const setObjNodeType = (reference: string, node: string): Action => ({
    type: 'visualization/setObjNode',
    payload: { reference, node }
})

const setTypeNodeType = (type: string, node: string): Action => ({
    type: 'visualization/setTypeNode',
    payload: { type, node }
})

export const actions = { load, setObjNodeType, setTypeNodeType }
