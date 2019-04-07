import { Reducer } from 'redux'
import * as protocol from '../protobuf/protocol'
import { AsyncAction } from './Store'

export type ScopeNode = {
    id: number
    name: string
    steps: number
    parentScope: ScopeNode
    subScopes: (number | ScopeNode)[]
}

type State = {
    readonly stack: { [id: number]: ScopeNode }
}

type Action = { type: 'graph/loadStack'; payload: { stack: State['stack'] } }

const initialState: State = {
    stack: undefined
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'graph/loadStack':
            return { ...state, ...action.payload }
    }
    return state
}

function loadStack(): AsyncAction {
    return async (dispatch, getState) => {
        const { debug } = getState()
        const stack: State['stack'] = { 0: { id: 0, name: '', steps: 0, parentScope: undefined, subScopes: [0] } }
        let scopeNodeRef = stack[0]
        debug.responses //
            .flatMap(response => response.events)
            .filter(event => !!event.inspected)
            .forEach(event => {
                const scopes = event.inspected.frame.stack.scopes
                const lastScope = scopes[scopes.length - 1]
                switch (event.inspected.frame.type) {
                    case protocol.Frame.Type.CALL:
                        const scopeNode: ScopeNode = {
                            id: 0,
                            name: lastScope.name,
                            steps: 0,
                            parentScope: scopeNodeRef,
                            subScopes: [0]
                        }
                        scopeNodeRef.subScopes.push(scopeNode)
                        scopeNodeRef = scopeNode
                        break
                    case protocol.Frame.Type.LINE:
                        scopeNodeRef.steps += 1
                        ;(scopeNodeRef.subScopes[scopeNodeRef.subScopes.length - 1] as number) += 1
                        break
                    case protocol.Frame.Type.EXCEPTION:
                        // TODO
                        break
                    case protocol.Frame.Type.RETURN:
                        scopeNodeRef.subScopes.push(0)
                        scopeNodeRef.parentScope.steps += scopeNodeRef.steps
                        scopeNodeRef.parentScope.subScopes.push(0)
                        scopeNodeRef = scopeNodeRef.parentScope
                        break
                }
            })
        dispatch({ type: 'graph/loadStack', payload: { stack } })
    }
}

export const actions = { loadStack }
