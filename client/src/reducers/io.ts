import { Reducer } from 'redux'

type State = {
    readonly content: ReadonlyArray<string>
    readonly input: string
}

type Action =
    | { type: 'io/reset' }
    | { type: 'io/appendOutput'; payload: { output: string } }
    | { type: 'io/commitInput' }
    | { type: 'io/setInput'; payload: { input: string } }

const initialState: State = {
    content: [],
    input: ''
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'io/reset':
            return { ...initialState }
        case 'io/appendOutput':
            return { ...state, content: [...state.content, action.payload.output] }
        case 'io/commitInput':
            return { ...state, content: [...state.content, `${state.input}\n`], input: '' }
        case 'io/setInput':
            return { ...state, input: action.payload.input }
    }
    return state
}
