import { Reducer } from 'redux'

type State = ReadonlySet<number>

type Action = { type: 'breakpoint/toggle'; payload: number }

const initialState: State = new Set()

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'breakpoint/toggle':
            const lines = state.has(action.payload)
                ? [...state].filter(line => line !== action.payload)
                : [...state, action.payload]
            return new Set(lines)
    }
    return state
}

function toggle(line: number): Action {
    return { type: 'breakpoint/toggle', payload: line }
}

export const actions = { toggle }
