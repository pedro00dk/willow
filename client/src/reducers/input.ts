/**
 * Input reducer updates the piece of state that stores program inputs written by the user.
 */
type State = { content: string[] }

type Action = { type: 'input/set'; payload: { content: string[]; update: boolean } }

const initialState: State = { content: [] }

export const reducer = (state: State = initialState, action: Action): State => {
    if (action.type === 'input/set') {
        state.content = action.payload.content
        return action.payload.update ? { ...state } : state
    }
    return state
}

const set = (content: string[], update = false): Action => ({ type: 'input/set', payload: { content, update } })

export const actions = { set }
