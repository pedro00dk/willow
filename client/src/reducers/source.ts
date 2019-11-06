type State = string[]

type Action = { type: 'source/set'; payload: string[] }

const initialState: State = []

export const reducer = (state: State = initialState, action: Action): State =>
    action.type === 'source/set' ? action.payload : state

const set = (source: string[]): Action => ({ type: 'source/set', payload: source })

export const actions = { set }
