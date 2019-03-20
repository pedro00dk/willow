import { Reducer } from 'redux'

type State = {
    readonly content: ReadonlyArray<string>
    readonly lastLineBreak: boolean
    readonly input: string
}

type Action =
    | { type: 'io/reset' }
    | { type: 'io/appendOutput'; payload: { output: string } }
    | { type: 'io/commitInput' }
    | { type: 'io/setInputLine'; payload: { input: string } }

const initialState: State = {
    content: [''],
    lastLineBreak: false,
    input: ''
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'io/reset':
            return { ...initialState }
        case 'io/appendOutput': {
            const outputLines = action.payload.output.split(/\r?\n/)
            const outputEndsInLineBreak = outputLines.length > 1 && outputLines[outputLines.length - 1].length === 0
            const mergeLine = state.lastLineBreak
                ? []
                : [`${state.content[state.content.length - 1]}${outputLines[0]}`]
            const contentLinesToConcat = mergeLine.length === 0 ? state.content : state.content.slice(0, -1)
            const outputLinesToConcat = mergeLine.length === 0 ? outputLines : outputLines.slice(1)
            const content = [...contentLinesToConcat, ...mergeLine, ...outputLinesToConcat]
            return { ...state, lastLineBreak: outputEndsInLineBreak, content }
        }
        case 'io/commitInput': {
            const content = state.lastLineBreak
                ? [...state.content, state.input]
                : [...state.content.slice(0, -1), `${state.content[state.content.length - 1]}${state.input}`]
            return { ...state, lastLineBreak: true, content }
        }
        case 'io/setInputLine':
            return { ...state, input: action.payload.input }
    }
    return state
}
