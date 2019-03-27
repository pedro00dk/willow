import { Reducer } from 'redux'

type State = { readonly lines: ReadonlySet<number> }

type Action = { type: 'breakpoints/set'; payload: { lines: number[] } }

const initialState: State = {
    lines: new Set()
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'breakpoints/set':
            return { ...state, lines: new Set(action.payload.lines) }
    }
    return state
}
