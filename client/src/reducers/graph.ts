import { Reducer } from 'redux'
import * as protocol from '../protobuf/protocol'
import { AsyncAction, State as StoreState } from './Store'

export type StackTreeNode = {
    name: string
    steps: number
    children: (StackTreeNode | StackTreeLeaf)[]
}

export type StackTreeLeaf = {
    steps: number
    framesIndices: number[]
}

export function isStackTreeNode(nodeOrLeaf: StackTreeNode | StackTreeLeaf): nodeOrLeaf is StackTreeNode {
    return (nodeOrLeaf as StackTreeNode).name != undefined
}

type State = {
    readonly framesIndices: protocol.IFrame[]
    readonly stackTree: StackTreeNode
    readonly index: number
}

type Action =
    | { type: 'graph/loadGraph'; payload: { framesIndices: protocol.IFrame[]; stackTree: StackTreeNode } }
    | { type: 'graph/setIndex'; payload: { index: number } }

const initialState: State = {
    framesIndices: undefined,
    stackTree: undefined,
    index: undefined
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'graph/loadGraph':
            return { ...initialState, ...action.payload }
        case 'graph/setIndex':
            const index = !state.framesIndices
                ? undefined
                : Math.min(Math.max(0, action.payload.index), state.framesIndices.length - 1)
            return { ...state, index }
    }
    return state
}

function loadFramesIndices(debug: StoreState['debug']) {
    return debug.responses
        .flatMap(response => response.events)
        .filter(event => !!event.inspected)
        .map(event => event.inspected.frame)
}
function loadStackTree(framesIndices: protocol.IFrame[]) {
    const treeBase: StackTreeNode = { name: '', steps: 0, children: [] }
    const treeChildrenStack = [treeBase]
    framesIndices //
        .forEach((frame, i) => {
            const scope = frame.stack.scopes[frame.stack.scopes.length - 1]
            const lastChild = treeChildrenStack[treeChildrenStack.length - 1]
            if (frame.type === protocol.Frame.Type.CALL) {
                const startLeaf: StackTreeLeaf = { steps: 0, framesIndices: [i] }
                const childNode: StackTreeNode = { name: scope.name, steps: 0, children: [startLeaf] }
                lastChild.children.push(childNode)
                treeChildrenStack.push(childNode)
            } else if (frame.type === protocol.Frame.Type.LINE) {
                lastChild.steps += 1
                const lastLeaf = lastChild.children[lastChild.children.length - 1] as StackTreeLeaf
                lastLeaf.steps += 1
                lastLeaf.framesIndices.push(i)
            } else if (frame.type === protocol.Frame.Type.EXCEPTION) {
                // TODO
            } else if (frame.type === protocol.Frame.Type.RETURN) {
                const lastLeaf = lastChild.children[lastChild.children.length - 1] as StackTreeLeaf
                lastLeaf.framesIndices.push(i)
                const lastChildParent = treeChildrenStack[treeChildrenStack.length - 2]
                lastChildParent.steps += lastChild.steps
                const newParentLeaf: StackTreeLeaf = { steps: 0, framesIndices: [] }
                lastChildParent.children.push(newParentLeaf)
                treeChildrenStack.pop()
            }
        })
    return treeBase.children[0] as StackTreeNode
}

function loadGraph(): AsyncAction {
    return async (dispatch, getState) => {
        const { debug } = getState()
        const framesIndices = loadFramesIndices(debug)
        const stackTree = loadStackTree(framesIndices)
        dispatch({ type: 'graph/loadGraph', payload: { framesIndices, stackTree } })
    }
}

function setIndex(index: number): Action {
    return { type: 'graph/setIndex', payload: { index } }
}

export const actions = { loadGraph, setIndex }
