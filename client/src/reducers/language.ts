import { Reducer } from 'redux'
import { serverApi } from '../server'
import { AsyncAction } from './Store'

type State = {
    readonly fetching: boolean
    readonly languages: string[]
    readonly selected: number
    readonly error: string
}
type Action =
    | { type: 'language/fetch'; payload?: { languages: string[] }; error?: string }
    | { type: 'language/select'; payload: { selected: number } }

const initialState: State = {
    fetching: false,
    languages: [],
    selected: undefined,
    error: undefined
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'language/fetch':
            if (!!action.payload)
                return {
                    ...state,
                    fetching: false,
                    languages: action.payload.languages,
                    selected: action.payload.languages.length > 0 ? 0 : undefined
                }
            if (!!action.error) return { ...state, fetching: false, error: action.error }
            return { ...initialState, fetching: true }
        case 'language/select':
            return { ...state, ...action.payload }
    }
    return state
}

const fetch = (): AsyncAction => {
    return async dispatch => {
        dispatch({ type: 'language/fetch' })
        try {
            const languages = (await serverApi.get('/tracers/getLanguages')).data as { languages: string[] }
            dispatch({ type: 'language/fetch', payload: { languages: languages.languages } })
        } catch (error) {
            dispatch({ type: 'language/fetch', error: !!error.response ? error.response.data : error.toString() })
        }
    }
}

const select = (selected: number): Action => ({ type: 'language/select', payload: { selected } })

export const actions = { fetch, select }
