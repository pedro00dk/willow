import { Reducer } from 'redux'
import * as protocol from '../../protobuf/protocol'
import { AsyncAction } from '../Store'

export type StackNode = {
    readonly name: string
    readonly steps: { from: number; to: number }
    readonly children: StackNode[]
}

type State = {
    readonly tree: StackNode
}

type Action = { type: 'debug/stack/load'; payload: State }

const initialState: State = {
    tree: undefined
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'debug/stack/load':
            return { ...state, ...action.payload }
    }
    return state
}

function load(): AsyncAction {
    return async (dispatch, getState) => {
        const { debugResult } = getState()
        const tree: StackNode = { name: undefined, steps: { from: 0, to: 0 }, children: [] }
        const treePath = [tree]
        debugResult.steps.forEach((step, i) => {
            const snapshot = step.snapshot
            const lastNode = treePath[treePath.length - 1]
            if (!snapshot) {
                const name = !!step.threw.exception ? step.threw.exception.type : step.threw.cause
                const threwNode: StackNode = {
                    name,
                    steps: { from: i, to: i },
                    children: [{ name: undefined, steps: { from: i, to: i }, children: [] }]
                }
                tree.children.push(threwNode)
                tree.steps.to = i
                return
            } else if (snapshot.type === protocol.Snapshot.Type.CALL) {
                const scope = snapshot.stack[snapshot.stack.length - 1]
                const callNode: StackNode = { name: scope.name, steps: { from: i, to: i }, children: [] }
                const callLeaf: StackNode = { name: undefined, steps: { from: i, to: i }, children: [] }
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
        dispatch({ type: 'debug/stack/load', payload: { tree } })
    }
}

export const actions = { load }
