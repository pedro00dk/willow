/**
 * Source reducer updates the state that stores the program source code.
 * This reducer state allows mutation of its contents, due to the fact that source is not observed in components.
 */
type State = { content: string[] }

type Action = { type: 'source/set'; payload: string[] }

const initialState: State = { content: [] }

export const reducer = (state: State = initialState, action: Action): State =>
    action.type === 'source/set' ? { content: action.payload } : state

const set = (source: string[]): Action => ({ type: 'source/set', payload: source })

export const actions = { set }
