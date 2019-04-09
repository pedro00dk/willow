import { Reducer } from 'redux'

type State = string[]

type Action = { type: 'input/set'; payload: string[] }

const initialState: State = []

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'input/set':
            return action.payload
    }
    return state
}

function set(lines: string[]): Action {
    return { type: 'input/set', payload: lines }
}

export const actions = { set }
