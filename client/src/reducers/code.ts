import { Reducer } from 'redux'

type State = {
    readonly main: string
    readonly code: string[]
    readonly breakpoints: ReadonlySet<number>
    readonly markers: ReadonlySet<{ line: number; type: 'highlight' | 'warning' | 'error' }>
}

type Action =
    | { type: 'code/setMain'; payload: { main: string } }
    | { type: 'code/setCode'; payload: { code: string[] } }
    | { type: 'code/setBreakpoint'; payload: { line: number } }
    | { type: 'code/setMarkers'; payload: { markers: { line: number; type: 'highlight' | 'warning' | 'error' }[] } }

const initialState: State = {
    main: undefined,
    code: [],
    breakpoints: new Set(),
    markers: new Set()
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'code/setMain':
            return { ...state, ...action.payload }
        case 'code/setCode':
            return { ...state, ...action.payload }
        case 'code/setBreakpoint': {
            const breakpoints = new Set(state.breakpoints)
            breakpoints.has(action.payload.line)
                ? breakpoints.delete(action.payload.line)
                : breakpoints.add(action.payload.line)
            return { ...state, breakpoints }
        }
        case 'code/setMarkers':
            return { ...state, markers: new Set(action.payload.markers) }
    }
    return state
}
