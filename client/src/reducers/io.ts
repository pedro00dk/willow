import { Reducer } from 'redux'

type State = {
    readonly output: ReadonlyArray<string>
    readonly input: ReadonlyArray<string>
}

type Action =
    | { type: 'io/reset' }
    | { type: 'io/appendOutput'; payload: { output: string } }
    | { type: 'io/commitInput' }
    | { type: 'io/setInputLine'; payload: { input: string } }

const initialState: State = {
    output: [''],
    input: ['']
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'io/reset':
            return { ...initialState }
        case 'io/appendOutput': {
            const lines = action.payload.output.split(/\r?\n/)
            const output = [...state.output.slice(0, -1), state.output.slice(-1)[0] + lines[0], ...lines.slice(1)]
            return { ...state, output }
        }
        case 'io/commitInput': {
            if (state.input.length < 2) break
            const input = state.input.slice(1)
            const output = [...state.output.slice(-1), state.output.slice(-1)[0] + state.input[0]]
            return { ...state, input, output }
        }
        case 'io/setInputLine':
            return { ...state, input: [...state.input.slice(0, -1), action.payload.input] }
    }
    return state
}
