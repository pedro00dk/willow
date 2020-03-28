/**
 * Error reducer stores errors of all other reducers.
 */
type State = { type: string; error: string }[]

type Action = { type: string; error?: string }

const initialState: State = []

export const reducer = (state: State = initialState, action: Action): State =>
    action.error ? [...state, { type: action.type, error: action.error }] : state

export const actions = {}
