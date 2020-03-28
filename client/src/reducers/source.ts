/**
 * Source reducer updates the state that stores the program source code.
 */
type State = { content: string[] }

type Action = { type: 'source/set'; payload: { content: string[]; update: boolean } }

const initialState: State = { content: [] }

export const reducer = (state: State = initialState, action: Action): State => {
    if (action.type === 'source/set') {
        state.content = action.payload.content
        return action.payload.update ? { ...state } : state
    }
    return state
}

const set = (content: string[], update = false): Action => ({ type: 'source/set', payload: { content, update } })

export const actions = { set }
