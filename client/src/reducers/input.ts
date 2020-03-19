/**
 * Input reducer updates the piece of state that stores program inputs written by the user.
 */
type State = string[]

type Action = { type: 'input/set'; payload: string[] }

const initialState: State = []

export const reducer = (state: State = initialState, action: Action): State =>
    action.type === 'input/set' ? action.payload : state

const set = (input: string[]): Action => ({ type: 'input/set', payload: input })

export const actions = { set }
