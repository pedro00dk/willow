type State = string[]

type Action = { type: 'input/set'; payload: string[] }

const initialState: State = []

export const reducer = (state: State = initialState, action: Action): State =>
    action.type === 'input/set' ? action.payload : state

const set = (input: string[]): Action => ({ type: 'input/set', payload: input })

export const actions = { set }
