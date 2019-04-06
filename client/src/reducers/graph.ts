import { Reducer } from 'redux'
import * as protocol from '../protobuf/protocol'

type ScopeNode = {
    id: number
    name: string
    steps: number
    parentScope: ScopeNode
    subScopes: (number | ScopeNode)[]
}

type State = {
    readonly stack: { [id: number]: ScopeNode }
}

type Action = { type: 'graph/setStack'; payload: { stack: { [id: number]: ScopeNode } } }

const initialState: State = {
    stack: {}
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'graph/setStack':
            return { ...state, ...action.payload }
    }
    return state
}

const setStack = (events: protocol.Event[]): Action => {
    const inspectedEvents = events.filter(event => !!event.inspected)
    const stack: State['stack'] = { 0: { id: 0, name: '', steps: 0, parentScope: undefined, subScopes: [] } }
    let scopeNodeRef = stack[0]
    inspectedEvents.forEach(event => {
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
                ;(scopeNodeRef.subScopes[scopeNodeRef.subScopes.length - 1] as number)++
                break
            case protocol.Frame.Type.EXCEPTION:
            // TODO
                break
            case protocol.Frame.Type.RETURN:
                scopeNodeRef.subScopes.push(0)
                scopeNodeRef = scopeNodeRef.parentScope
                scopeNodeRef.subScopes.push(0)
                break
        }
    })
    return { type: 'graph/setStack', payload: { stack } }
}

export const actions = { toggle: setStack }
