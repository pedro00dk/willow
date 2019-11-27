import { serverApi } from '../server'
import { DefaultAsyncAction } from './Store'

type State = {
    fetching: boolean
    languages: string[]
    selected: number
    error?: string
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
                ? { ...state, languages: action.payload, selected: 0, fetching: false }
                : action.error
                ? { ...initialState, error: action.error }
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
        const languages = (await serverApi.get<string[]>('/languages')).data
        dispatch({ type: 'language/fetch', payload: languages })
    } catch (error) {
        dispatch({ type: 'language/fetch', error: error?.response?.data ?? error.toString() })
    }
}

const select = (selected: number): Action => ({ type: 'language/select', payload: selected })

export const actions = { fetch, select }
