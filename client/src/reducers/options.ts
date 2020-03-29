/**
 * Input reducer updates some tracing and visualization options.
 */
type State = {
    visualization: boolean
    preserveLayout: boolean
    liveProgramming: boolean
}

type Action =
    | { type: 'options/set'; payload: State }
    | { type: 'options/setVisualization'; payload: boolean }
    | { type: 'options/setPreserveLayout'; payload: boolean }
    | { type: 'options/setLiveProgramming'; payload: boolean }

const initialState: State = {
    visualization: true,
    preserveLayout: true,
    liveProgramming: true
}

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case 'options/set':
            return action.payload
        case 'options/setVisualization':
            return { ...state, visualization: action.payload }
        case 'options/setPreserveLayout':
            return { ...state, preserveLayout: action.payload }
        case 'options/setLiveProgramming':
            return { ...state, liveProgramming: action.payload }
        default:
            return state
    }
}

const set = (options: Partial<State>): Action => ({ type: 'options/set', payload: { ...initialState, ...options } })

const setVisualization = (enableVisualization: boolean): Action => ({
    type: 'options/setVisualization',
    payload: enableVisualization
})

const setPreserveLayout = (preserveLayout: boolean): Action => ({
    type: 'options/setPreserveLayout',
    payload: preserveLayout
})

const setLiveProgramming = (liveProgramming: boolean): Action => ({
    type: 'options/setLiveProgramming',
    payload: liveProgramming
})

export const actions = { set, setVisualization, setPreserveLayout, setLiveProgramming }
