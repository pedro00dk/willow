/**
 * Action reducer sends user actions to the server.
 */
import { api } from '../api'
import { RequestAction } from '../types/model'
import { DefaultAsyncAction } from './Store'

type State = {
    error?: string
}

type Action = { type: 'action/send'; payload?: {}; error?: string }

const initialState: State = {}

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case 'action/send':
            return action.payload ? state : action.error != undefined ? { error: action.error } : state
        default:
            return state
    }
}

const send = (action: Pick<RequestAction, 'name' | 'payload'>): DefaultAsyncAction => async (dispatch, getState) => {
    const user = getState().user.user
    if (!user) return
    dispatch({ type: 'action/send' })
    try {
        await api.post('/api/action', { ...action, date: new Date().toJSON() })
        dispatch({ type: 'action/send', payload: {} })
    } catch (error) {
        dispatch({ type: 'action/send', error: error?.response?.data ?? error.toString() })
    }
}

export const actions = { send }
