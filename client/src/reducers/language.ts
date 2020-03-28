/**
 * Language reducer stores the available programming languages and which one is chosen.
 */
import { api } from '../api'
import { DefaultAsyncAction } from './Store'

type State = {
    fetching: boolean
    languages: string[]
    selected: number
}

type Action =
    | { type: 'language/fetch'; payload?: string[]; error?: string }
    | { type: 'language/select'; payload: number }

const initialState: State = {
    fetching: false,
    languages: [],
    selected: 0
}

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case 'language/fetch':
            return action.payload
                ? { ...initialState, languages: action.payload, selected: 0 }
                : action.error != undefined
                ? { ...initialState }
                : { ...initialState, fetching: true }
        case 'language/select':
            return { ...state, selected: action.payload }
        default:
            return state
    }
}

const fetch = (): DefaultAsyncAction => async dispatch => {
    dispatch({ type: 'language/fetch' })
    try {
        const languages = (await api.get<string[]>('/api/tracer/languages')).data
        dispatch({ type: 'language/fetch', payload: languages })
    } catch (error) {
        dispatch({ type: 'language/fetch', error: error?.response?.data ?? error.toString() })
    }
}

const select = (selected: number): Action => ({ type: 'language/select', payload: selected })

export const actions = { fetch, select }
