/**
 * Input reducer updates the piece of state that stores program inputs written by the user.
 * This reducer state allows mutation of its contents, due to the fact that input is not observed in components.
 */
type State = { content: string[] }

type Action = { type: 'input/set'; payload: string[] }

const initialState: State = { content: [] }

export const reducer = (state: State = initialState, action: Action): State =>
    action.type === 'input/set' ? { content: action.payload } : state

const set = (input: string[]): Action => ({ type: 'input/set', payload: input })

export const actions = { set }
