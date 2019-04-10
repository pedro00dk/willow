import { Reducer } from 'redux'
import * as protocol from '../../protobuf/protocol'
import { AsyncAction } from '../Store'

export type StackNode = {
    name: string
    steps: { from: number; to: number }
    children: StackNode[]
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
        const treeBase: StackNode = { name: '', steps: { from: 0, to: 0 }, children: [] }
        const treeChildrenStack = [treeBase]
        debugResponse.steps.forEach((step, i) => {
            const frame = step.frame
            const scope = frame.stack.scopes[frame.stack.scopes.length - 1]
            const lastNonTerminalChild = treeChildrenStack[treeChildrenStack.length - 1]

            if (frame.type === protocol.Frame.Type.CALL) {
                const callNode: StackNode = { name: scope.name, steps: { from: i, to: i }, children: [] }
                const terminalNode: StackNode = { name: undefined, steps: { from: i, to: i }, children: [] }
                callNode.children.push(terminalNode)
                lastNonTerminalChild.children.push(callNode)
                treeChildrenStack.push(callNode)
            } else if (frame.type === protocol.Frame.Type.LINE || frame.type === protocol.Frame.Type.EXCEPTION) {
                const terminalNode = lastNonTerminalChild.children[lastNonTerminalChild.children.length - 1]
                if (terminalNode.steps.from == undefined) terminalNode.steps.from = i
                terminalNode.steps.to = i
            } else if (frame.type === protocol.Frame.Type.RETURN) {
                const terminalNode = lastNonTerminalChild.children[lastNonTerminalChild.children.length - 1]
                if (terminalNode.steps.from == undefined) terminalNode.steps.from = i
                terminalNode.steps.to = i
                lastNonTerminalChild.steps.to = i
                const previousNonTerminalChild = treeChildrenStack[treeChildrenStack.length - 2]
                const previousTerminalNode: StackNode = {
                    name: undefined,
                    steps: { from: undefined, to: undefined },
                    children: []
                }
                previousNonTerminalChild.children.push(previousTerminalNode)
                treeChildrenStack.pop()
            }
        })
        const tree = treeBase.children[0] as StackNode
        dispatch({ type: 'debug/stack/loadStack', payload: { tree } })
    }
}

export const actions = { loadStack }
