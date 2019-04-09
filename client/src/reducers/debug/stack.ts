import { Reducer } from 'redux'
import * as protocol from '../../protobuf/protocol'
import { AsyncAction } from '../Store'

export type StackNode = {
    name: string
    steps: number
    children: (StackNode | StackLeaf)[]
}

export type StackLeaf = {
    steps: number
    framesIndices: number[]
}

export function isStackNode(nodeOrLeaf: StackNode | StackLeaf): nodeOrLeaf is StackNode {
    return (nodeOrLeaf as StackNode).name != undefined
}

export function isStackLeaf(nodeOrLeaf: StackNode | StackLeaf): nodeOrLeaf is StackLeaf {
    return !!(nodeOrLeaf as StackLeaf).framesIndices
}

type State = {
    tree: StackNode
}

type Action = { type: 'debug/stack/loadStack'; payload: State }

const initialState: State = {
    tree: undefined
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'debug/stack/loadStack':
            return { ...state, ...action.payload }
    }
    return state
}

function loadStack(): AsyncAction {
    return async (dispatch, getState) => {
        const { debugResponse } = getState()
        const treeBase: StackNode = { name: '', steps: 0, children: [] }
        const treeChildrenStack = [treeBase]
        debugResponse.steps.forEach((step, i) => {
            const frame = step.frame
            const scope = frame.stack.scopes[frame.stack.scopes.length - 1]
            const lastChild = treeChildrenStack[treeChildrenStack.length - 1]
            if (frame.type === protocol.Frame.Type.CALL) {
                const startLeaf: StackLeaf = { steps: 0, framesIndices: [i] }
                const childNode: StackNode = { name: scope.name, steps: 0, children: [startLeaf] }
                lastChild.children.push(childNode)
                treeChildrenStack.push(childNode)
            } else if (frame.type === protocol.Frame.Type.LINE || frame.type === protocol.Frame.Type.EXCEPTION) {
                lastChild.steps += 1
                const lastLeaf = lastChild.children[lastChild.children.length - 1] as StackLeaf
                lastLeaf.steps += 1
                lastLeaf.framesIndices.push(i)
            } else if (frame.type === protocol.Frame.Type.RETURN) {
                const lastLeaf = lastChild.children[lastChild.children.length - 1] as StackLeaf
                lastLeaf.framesIndices.push(i)
                const lastChildParent = treeChildrenStack[treeChildrenStack.length - 2]
                lastChildParent.steps += lastChild.steps
                const newParentLeaf: StackLeaf = { steps: 0, framesIndices: [] }
                lastChildParent.children.push(newParentLeaf)
                treeChildrenStack.pop()
            }
        })
        const tree = treeBase.children[0] as StackNode
        dispatch({ type: 'debug/stack/loadStack', payload: { tree } })
    }
}

export const actions = { loadStack }
