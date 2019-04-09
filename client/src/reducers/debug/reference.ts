import { Reducer } from 'redux'

type State = number

type Action = { type: 'debug/reference/set'; payload: number }

const initialState: State = 0

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'debug/reference/set':
            return action.payload
    }
    return state
}

function set(index: number): Action {
    return { type: 'debug/reference/set', payload: index }
}

export const actions = { set }
