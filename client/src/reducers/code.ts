import { Reducer } from 'redux'

type State = string[]

type Action = { type: 'code/set'; payload: string[] }

const initialState: State = []

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'code/set':
            return action.payload
    }
    return state
}

function set(code: string[]): Action {
    return { type: 'code/set', payload: code }
}

export const actions = { set }
