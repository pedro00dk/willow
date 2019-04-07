import { Reducer } from 'redux'

type State = {
    readonly lines: string[]
}

type Action = { type: 'input/set'; payload: { lines: string[] } }

const initialState: State = {
    lines: []
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'input/set':
            return { ...state, ...action.payload }
    }
    return state
}

function set(lines: string[]): Action {
    return { type: 'input/set', payload: { lines } }
}

export const actions = { set }
