/**
 * Language reducer stores the available programming languages and which one is chosen.
 */
import firebase from 'firebase'
import { DefaultAsyncAction } from './Store'

type State = {
    fetching: boolean
    languages: { [language: string]: string }
    selected: string
}

type Action =
    | { type: 'language/fetch'; payload?: { [language: string]: string }; error?: string }
    | { type: 'language/select'; payload: string }

const initialState: State = {
    fetching: false,
    languages: {},
    selected: undefined
}

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case 'language/fetch':
            return action.payload
                ? { ...initialState, languages: action.payload, selected: Object.keys(action.payload)[0] }
                : action.error
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
        const languages = (await firebase.firestore().collection('languages').get()).docs
            .map(doc => ({ language: doc.id, url: doc.data().tracer }))
            .reduce((acc, next) => ((acc[next.language] = next.url), acc), {} as { [language: string]: string })
        dispatch({ type: 'language/fetch', payload: languages })
    } catch (error) {
        dispatch({ type: 'language/fetch', error: error?.response?.data ?? error.toString() })
    }
}

const select = (selected: string): Action => ({ type: 'language/select', payload: selected })

export const actions = { fetch, select }
