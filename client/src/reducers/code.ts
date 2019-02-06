import { Reducer } from 'redux'

export type State = { text: string, breakpoints: Set<number> }
export type Action =
    { type: 'code/setText', payload: { text: string } } |
    { type: 'code/setBreakpoint', payload: { line: number } }

const initialState: State = {
    text: '',
    breakpoints: new Set()
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    if (!action) return state
    switch (action.type) {
        case 'code/setText': return { ...state, ...action.payload }
        case 'code/setBreakpoint': {
            const breakpoints = new Set(state.breakpoints)
            breakpoints.has(action.payload.line)
                ? breakpoints.delete(action.payload.line)
                : breakpoints.add(action.payload.line)
            return { ...state, breakpoints }
        }
    }
    return state
}
