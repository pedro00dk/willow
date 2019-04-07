import { Reducer } from 'redux'

type State = {
    readonly lines: ReadonlySet<number>
}

type Action = { type: 'breakpoint/toggle'; payload: { line: number } }

const initialState: State = {
    lines: new Set()
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'breakpoint/toggle':
            const lines = state.lines.has(action.payload.line)
                ? [...state.lines].filter(line => line !== action.payload.line)
                : [...state.lines, action.payload.line]
            return { ...state, lines: new Set(lines) }
    }
    return state
}

function toggle(line: number): Action {
    return { type: 'breakpoint/toggle', payload: { line } }
}

export const actions = { toggle }
