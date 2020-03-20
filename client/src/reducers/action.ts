/**
 * Action reducer sends user actions to the server.
 */
import { api } from '../api'
import { RequestAction } from '../types/model'
import { DefaultAsyncAction } from './Store'

type State = {
    cache: RequestAction[]
    sending: RequestAction[]
    initialized: boolean
    error?: string
}

type Action =
    | { type: 'action/append'; payload: RequestAction }
    | { type: 'action/initSender' }
    | { type: 'action/send'; payload: {}; error?: string }

const initialState: State = {
    cache: [],
    sending: [],
    initialized: false
}

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case 'action/append':
            state.cache.push(action.payload)
            return { ...state }
        case 'action/initSender':
            return { ...state, initialized: true }
        case 'action/send':
            return action.payload
                ? { ...state, cache: [] }
                : action.error != undefined
                ? { ...state, cache: [...state.sending, ...state.cache], sending: [], error: action.error }
                : { ...state, cache: [], sending: state.cache }
        default:
            return state
    }
}

const send = (): DefaultAsyncAction => async (dispatch, getState) => {
    const initialized = getState().action.initialized
    if (initialized) return
    dispatch({ type: 'action/initSender' })
    setInterval(async () => {
        dispatch({ type: 'action/send' })
        const sending = getState().action.sending
        if (sending.length === 0) return
        try {
            await api.post('/api/action', sending)
            dispatch({ type: 'action/send', payload: {} })
        } catch (error) {
            dispatch({ type: 'action/send', error: error?.response?.data ?? error.toString() })
        }
    }, 5000)
}

const append = (action: Pick<RequestAction, 'name' | 'payload'>): DefaultAsyncAction => async (dispatch, getState) => {
    const user = getState().user.user
    if (!user) return
    dispatch(send())
    dispatch({ type: 'action/append', payload: { ...action, date: new Date().toJSON() } })
}

export const actions = { append }
