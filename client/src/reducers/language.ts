import { Reducer } from 'redux'
import { serverApi } from '../server'
import { ThunkAction } from './Store'

type State = {
    readonly languages: string[]
    readonly fetching: boolean
    readonly error: string
}
type Action = { type: 'language/fetch'; payload?: { languages: string[] }; error?: string }

const initialState: State = {
    languages: [],
    fetching: false,
    error: undefined
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'language/fetch':
            if (!!action.payload) return { ...state, fetching: false, languages: action.payload.languages }
            if (!!action.error) return { ...state, fetching: false, error: action.error }
            return { ...initialState, fetching: true }
    }
    return state
}

export function fetch(): ThunkAction {
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
