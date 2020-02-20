/**
 * Input reducer updates some tracing and visualization options.
 */
type State = {
    liveProgramming: boolean
    preserveLayout: boolean
}

type Action =
    | { type: 'options/setLiveProgramming'; payload: boolean }
    | { type: 'options/setPreserveLayout'; payload: boolean }

const initialState: State = {
    liveProgramming: true, // TODO Implement
    preserveLayout: true // TODO Write requirements in schema (from 0 ordered obj references)
}

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case 'options/setLiveProgramming':
            return { ...state, liveProgramming: action.payload }
        case 'options/setPreserveLayout':
            return { ...state, preserveLayout: action.payload }
        default:
            return state
    }
}

const setLiveProgramming = (liveProgramming: boolean): Action => ({
    type: 'options/setLiveProgramming',
    payload: liveProgramming
})

const setPreserveLayout = (preserveLayout: boolean): Action => ({
    type: 'options/setPreserveLayout',
    payload: preserveLayout
})

export const actions = { setLiveProgramming, setPreserveLayout }
