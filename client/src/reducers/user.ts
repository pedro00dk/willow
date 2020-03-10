import { api } from '../api'
import { DefaultAsyncAction } from './Store'
/**
 * User reducer updates the user information and collect user actions.
 */
type State = {
    fetching: boolean
    signed: boolean
    email: string
    actions: ({ time: Date } & (
        | { action: 'login' }
        | { action: 'trace'; steps: string; code: string; compilationFail: boolean; executionFail: boolean }
        | { action: 'loadWillowExample'; exampleId: string }
        | { action: 'loadOwnExample'; exampleId: string }
        | { action: 'saveOwnExample'; exampleId: string }
    ))[]
    error?: string
}

type Action =
    | { type: 'user/signin' }
    | { type: 'user/signout' }
    | { type: 'user/fetch'; payload?: string; error?: string }
    | { type: 'user/action'; payload?: State['actions'][0]; error?: string }

const initialState: State = {
    fetching: false,
    signed: false,
    email: undefined,
    actions: []
}

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case 'user/signin':
        case 'user/signout':
            return state
        case 'user/fetch':
            return action.payload
                ? { ...state, fetching: false, signed: true, email: action.payload }
                : action.error != undefined
                ? { ...initialState, error: action.error }
                : { ...initialState, fetching: true }
        case 'user/action':
        default:
            return state
    }
}

const signin = (): DefaultAsyncAction => async () => {
    window.location.href = `${api.getUri()}/api/authentication/signin`
}

const signout = (): DefaultAsyncAction => async () => {
    window.location.href = `${api.getUri()}/api/authentication/signout`
}

const fetch = (): DefaultAsyncAction => async dispatch => {
    dispatch({ type: 'user/fetch' })
    try {
        const user = (await api.get('/api/authentication/user')).data as { email: string }
        dispatch({ type: 'user/fetch', payload: user.email })
    } catch (error) {
        dispatch({ type: 'user/fetch', error: error?.response?.data ?? error.toString() })
    }
}

export const actions = { signin, signout, fetch }
