import { api, apiUrl } from '../api'
import { Action as UserAction, Program, User } from '../types/model'
import { DefaultAsyncAction } from './Store'
/**
 * User reducer updates the user information and collect user actions.
 */
type State = {
    fetching: boolean
    fetchingPrograms: boolean
    user: User
    programs: Program[]
    error?: string
}

type Action =
    | { type: 'user/signin' }
    | { type: 'user/signout' }
    | { type: 'user/fetch'; payload?: User; error?: string }
    | { type: 'user/fetchPrograms'; payload?: Program[]; error?: string }
    | { type: 'user/sendAction'; error?: string }

const initialState: State = {
    fetching: false,
    fetchingPrograms: false,
    user: undefined,
    programs: []
}

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case 'user/signin':
        case 'user/signout':
            return state
        case 'user/fetch':
            return action.payload
                ? { ...initialState, fetching: false, user: action.payload }
                : action.error != undefined
                ? { ...initialState, error: action.error }
                : { ...initialState, fetching: true }
        case 'user/fetchPrograms':
            return action.payload
                ? { ...state, fetchingPrograms: false, programs: action.payload }
                : action.error != undefined
                ? { ...state, fetchingPrograms: false, programs: [], error: action.error }
                : { ...state, fetchingPrograms: true, programs: [] }
        case 'user/sendAction':
        default:
            return state
    }
}

const signin = (): DefaultAsyncAction => async () => {
    window.location.href = `${apiUrl}/api/auth/signin`
}

const signout = (): DefaultAsyncAction => async () => {
    window.location.href = `${apiUrl}/api/auth/signout`
}

const fetch = (): DefaultAsyncAction => async dispatch => {
    dispatch({ type: 'user/fetch' })
    try {
        const user = (await api.get<User>('/api/auth/user')).data
        dispatch({ type: 'user/fetch', payload: user })
    } catch (error) {
        dispatch({ type: 'user/fetch', error: error?.response?.data ?? error.toString() })
    }
}

const fetchPrograms = (): DefaultAsyncAction => async dispatch => {
    dispatch({ type: 'user/fetchPrograms' })
    try {
        const programs = (await api.get<User>('/api/program')).data
        dispatch({ type: 'user/fetchPrograms', payload: programs })
    } catch (error) {
        dispatch({ type: 'user/fetchPrograms', error: error?.response?.data ?? error.toString() })
    }
}

const sendAction = (action: UserAction): DefaultAsyncAction => async dispatch => {
    dispatch({ type: 'user/sendAction' })
    try {
        await api.post('/api/action', action)
        dispatch({ type: 'user/sendAction' })
    } catch (error) {
        dispatch({ type: 'user/sendAction', error: error?.response?.data ?? error.toString() })
    }
}

export const actions = { signin, signout, fetch, fetchPrograms, sendAction }
