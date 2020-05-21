import firebase from 'firebase/app'
import { DefaultAsyncAction } from './Store'

/**
 * User reducer updates the user information and collect user actions.
 */
type State = {
    fetching: boolean
    user: { id: string; name: string; email: string }
    actions: {
        cache: { name: string; date: string; payload: any }[]
        sending: { name: string; date: string; payload: any }[]
    }
    sender: boolean
}

type Action =
    | { type: 'user/signin' }
    | { type: 'user/signout' }
    | { type: 'user/load'; payload?: { user: State['user'] } }
    | { type: 'user/action'; payload: State['actions']['cache'][0] }
    | { type: 'user/sender'; payload: boolean }
    | { type: 'user/send'; payload: {}; error?: string }

const initialState: State = {
    fetching: false,
    user: undefined,
    actions: { cache: [], sending: [] },
    sender: false
}

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case 'user/signin':
        case 'user/signout':
            return state
        case 'user/load':
            return action.payload
                ? { ...initialState, fetching: false, ...action.payload }
                : { ...initialState, fetching: true }
        case 'user/action':
            state.actions.cache.push(action.payload)
            return state
        case 'user/sender':
            return { ...state, sender: action.payload }
        case 'user/send':
            return action.payload
                ? { ...state, actions: { cache: state.actions.cache, sending: [] } }
                : action.error
                ? { ...state, actions: { cache: [...state.actions.sending, ...state.actions.cache], sending: [] } }
                : { ...state, actions: { cache: [], sending: state.actions.cache }, sender: true }
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

const action = (action: Partial<State['actions']['cache'][0]>): DefaultAsyncAction => async (dispatch, getState) => {
    const user = getState().user.user
    if (!user) return
    dispatch(sender(), false)
    dispatch({ type: 'user/action', payload: { ...action, date: new Date().toJSON() } }, false)
}

const sender = (): DefaultAsyncAction => async (dispatch, getState) => {
    const enabled = getState().user.sender
    if (enabled) return
    dispatch({ type: 'user/sender', payload: true }, false)
    const send = async () => {
        const cache = getState().user.actions.cache
        if (cache.length === 0) return
        dispatch({ type: 'user/send' }, false)
        const sending = getState().user.actions.sending
        const user = getState().user.user
        try {
            await firebase
                .firestore()
                .collection('actions')
                .doc(user.id)
                .update({ actions: firebase.firestore.FieldValue.arrayUnion(...sending) })
            dispatch({ type: 'user/send', payload: {} }, false)
        } catch (error) {
            dispatch({ type: 'user/send', error: error.toString() }, false)
        }
    }
    setInterval(send, 10000)
    window.onunload = send
}

export const actions = { signin, signout, fetch, action }
