/**
 * Input reducer updates some tracing and visualization options.
 */
type State = {
    enableVisualization: boolean
    preserveLayout: boolean
    liveProgramming: boolean
}

type Action =
    | { type: 'options/set'; payload: State }
    | { type: 'options/setEnableVisualization'; payload: boolean }
    | { type: 'options/setPreserveLayout'; payload: boolean }
    | { type: 'options/setLiveProgramming'; payload: boolean }

const initialState: State = {
    enableVisualization: true,
    preserveLayout: true,
    liveProgramming: true
}

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case 'options/set':
            return action.payload
        case 'options/setEnableVisualization':
            return { ...state, enableVisualization: action.payload }
        case 'options/setPreserveLayout':
            return { ...state, preserveLayout: action.payload }
        case 'options/setLiveProgramming':
            return { ...state, liveProgramming: action.payload }
        default:
            return state
    }
}

const set = (options: Partial<State>): Action => ({ type: 'options/set', payload: { ...initialState, ...options } })

const setEnableVisualization = (enableVisualization: boolean): Action => ({
    type: 'options/setEnableVisualization',
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

export const actions = { set, setEnableVisualization, setPreserveLayout, setLiveProgramming }
