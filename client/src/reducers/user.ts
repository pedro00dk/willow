import firebase from 'firebase/app'
import { Program, RequestAction } from '../types/model'
import { DefaultAsyncAction } from './Store'

/**
 * User reducer updates the user information and collect user actions.
 */
type State = {
    fetching: boolean
    user: { id: string; name: string; email: string }
    actions: { cache: RequestAction[]; sending: RequestAction[] }
    initialized: boolean
    programs: Program[]
}

type Action =
    | { type: 'user/signin' }
    | { type: 'user/signout' }
    | { type: 'user/load'; payload?: { user: State['user'] } }
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
        case 'user/load':
            console.log(action)
            const a = action.payload
                ? { ...initialState, fetching: false, ...action.payload }
                : { ...initialState, fetching: true }
            console.log('reducer', action.payload)
            return a

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
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithRedirect(provider)
}

const signout = (): DefaultAsyncAction => async () => {
    firebase.auth().signOut()
}

const fetch = (): DefaultAsyncAction => async dispatch => {
    dispatch({ type: 'user/load' })
    firebase.auth().onAuthStateChanged(user => {
        dispatch({
            type: 'user/load',
            payload: { user: user ? { id: user.uid, name: user.displayName, email: user.email } : undefined }
        })
    })
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
