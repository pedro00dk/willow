import { Program, RequestAction, User } from '../types/model'
import { DefaultAsyncAction } from './Store'

/**
 * User reducer updates the user information and collect user actions.
 */
type State = {
    fetching: boolean
    user: User
    actions: { cache: RequestAction[]; sending: RequestAction[] }
    initialized: boolean
    programs: Program[]
}

type Action =
    | { type: 'user/signin' }
    | { type: 'user/signout' }
    | { type: 'user/fetch'; payload?: { user: User; programs: Program[] }; error?: string }
    | { type: 'user/action'; payload: RequestAction }
    | { type: 'user/actionInit'; payload: boolean }
    | { type: 'user/actionSend'; payload: {}; error?: string }

const initialState: State = {
    fetching: false,
    user: undefined,
    actions: { cache: [], sending: [] },
    initialized: false,
    programs: []
}

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case 'user/signin':
        case 'user/signout':
            return state
        case 'user/fetch':
            return action.payload
                ? { ...initialState, fetching: false, ...action.payload }
                : action.error
                ? { ...initialState }
                : { ...initialState, fetching: true }
        case 'user/action':
            state.actions.cache.push(action.payload)
            return { ...state }
        case 'user/actionInit':
            return { ...state, initialized: action.payload }
        case 'user/actionSend':
            return action.payload
                ? { ...state, actions: { cache: state.actions.cache, sending: [] } }
                : action.error
                ? { ...state, actions: { cache: [...state.actions.sending, ...state.actions.cache], sending: [] } }
                : { ...state, actions: { cache: [], sending: state.actions.cache }, initialized: true }
        default:
            return state
    }
}

const signin = (): DefaultAsyncAction => async () => {
    // window.location.href = `${apiUrl}/api/auth/signin`
}

const signout = (): DefaultAsyncAction => async () => {
    // window.location.href = `${apiUrl}/api/auth/signout`
}

const fetch = (): DefaultAsyncAction => async dispatch => {
    // dispatch({ type: 'user/fetch' })
    // try {
    //     let user = (await api.get<User>('/api/auth/user')).data
    //     user = typeof user === 'object' ? user : undefined
    //     const programs = user ? (await api.get<Program[]>('/api/program')).data : []
    //     dispatch({ type: 'user/fetch', payload: { user, programs } })
    // } catch (error) {
    //     dispatch({ type: 'user/fetch', error: error?.response?.data ?? error.toString() })
    // }
}

const action = (action: Pick<RequestAction, 'name' | 'payload'>): DefaultAsyncAction => async (dispatch, getState) => {
    // const user = getState().user.user
    // if (!user) return
    // dispatch(sendAction())
    // dispatch({ type: 'user/action', payload: { ...action, date: new Date().toJSON() } })
}

const sendAction = (): DefaultAsyncAction => async (dispatch, getState) => {
    // const initialized = getState().user.initialized
    // if (initialized) return
    // dispatch({ type: 'user/actionInit', payload: true })
    // setInterval(async () => {
    //     const cache = getState().user.actions.cache
    //     if (cache.length === 0) return
    //     dispatch({ type: 'user/actionSend' }, false)
    //     const sending = getState().user.actions.sending
    //     try {
    //         await api.post('/api/action', sending)
    //         dispatch({ type: 'user/actionSend', payload: {} }, false)
    //     } catch (error) {
    //         dispatch({ type: 'user/actionSend', error: error?.response?.data ?? error.toString() })
    //         dispatch({ type: 'user/actionInit', payload: false }, false)
    //     }
    // }, 5000)
}

export const actions = { signin, signout, fetch, action }
