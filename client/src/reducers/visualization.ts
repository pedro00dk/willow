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
    readonly nodeTypes: { [reference: string]: string }
}

type Action =
    | { type: 'visualization/load'; payload: { stack: Stack; heaps: Heap[] } }
    | { type: 'visualization/setNodeType'; payload: { reference: string; type: string } }

const initialState: State = {
    stack: undefined,
    heaps: [],
    nodeTypes: {}
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'visualization/load':
            return { ...initialState, ...action.payload }
        case 'visualization/setNodeType':
            return { ...state, nodeTypes: { ...state.nodeTypes, [action.payload.reference]: action.payload.type } }
    }
    return state
}

const buildStack = (steps: protocol.IStep[]) => {
    const root: Scope = { name: undefined, steps: { from: 0, to: 0 }, children: [] }
    const treePath = [root]
    steps.forEach((step, i) => {
        const snapshot = step.snapshot
        const lastNode = treePath[treePath.length - 1]
        if (!snapshot) {
            const name = !!step.threw.exception ? step.threw.exception.type : step.threw.cause
            const threwNode: Scope = {
                name,
                steps: { from: i, to: i },
                children: [{ name: undefined, steps: { from: i, to: i }, children: [] }]
            }
            root.children.push(threwNode)
            root.steps.to = i
            return
        } else if (snapshot.type === protocol.Snapshot.Type.CALL) {
            const scope = snapshot.stack[snapshot.stack.length - 1]
            const callNode: Scope = { name: scope.name, steps: { from: i, to: i }, children: [] }
            const callLeaf: Scope = { name: undefined, steps: { from: i, to: i }, children: [] }
            callNode.children.push(callLeaf)
            lastNode.children.push(callNode)
            treePath.forEach(node => (node.steps.to = i))
            treePath.push(callNode)
        } else {
            // creates a new leaf if the previous leaf does not have any child (it happens after a RETURN)
            const createLeaf = lastNode.children[lastNode.children.length - 1].children.length > 0
            if (createLeaf) lastNode.children.push({ name: undefined, steps: { from: i, to: i }, children: [] })
            //
            const lastLeaf = lastNode.children[lastNode.children.length - 1]
            lastLeaf.steps.to = i
            treePath.forEach(node => (node.steps.to = i))
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
        Object.entries(step.snapshot.heap).forEach(([reference, obj]) => {
            heap[reference] = {
                reference,
                type: obj.type,
                languageType: obj.languageType,
                userDefined: obj.userDefined,
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

const setDrawType = (reference: string, type: string): Action => ({
    type: 'visualization/setNodeType',
    payload: { reference, type }
})

export const actions = { load, setDrawType }
