import { Reducer } from 'redux'
import { serverApi } from '../server'
import { AsyncAction } from './Store'

type State = {
    language: string
    languages: Set<string>
    source: string[]
    input: string[]
    fetching: boolean
    error: string
}

type Action =
    | { type: 'program/fetchLanguages'; payload?: { languages: string[] }; error?: string }
    | { type: 'program/selectLanguage'; payload: string }
    | { type: 'program/setSource'; payload: string[] }
    | { type: 'program/setInput'; payload: string[] }

const initialState: State = {
    language: undefined,
    languages: new Set(),
    source: [],
    input: [],
    fetching: false,
    error: undefined
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'program/fetchLanguages':
            if (action.payload) return { ...state, languages: new Set(action.payload.languages), fetching: false }
            if (action.error) return { ...state, fetching: false, error: action.error }
            return { ...state, fetching: true }
        case 'program/selectLanguage':
            return { ...state, language: state.languages.has(action.payload) ? action.payload : undefined }
        case 'program/setSource':
            return { ...state, source: action.payload }
        case 'program/setInput':
            return { ...state, input: action.payload }
    }
    return state
}

export const actions = {
    fetchLanguages: (): AsyncAction => async dispatch => {
        dispatch({ type: 'program/fetchLanguages' })
        try {
            const languages = (await serverApi.get('/languages')).data as string[]
            dispatch({ type: 'program/fetchLanguages', payload: { languages } })
        } catch (error) {
            dispatch({ type: 'program/fetchLanguages', error: error.response ? error.response.data : error.toString() })
        }
    },
    selectLanguage: (selected: string): Action => ({ type: 'program/selectLanguage', payload: selected }),
    setSource: (source: string[]): Action => ({ type: 'program/setSource', payload: source }),
    setInput: (input: string[]): Action => ({ type: 'program/setInput', payload: input })
}
