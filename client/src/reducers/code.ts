import { Reducer } from 'redux'

export enum MarkerType {
    HIGHLIGHT,
    WARNING,
    ERROR
}

type State = {
    readonly main: string
    readonly code: string[]
}

type Action =
    | { type: 'code/setMain'; payload: { main: string } }
    | { type: 'code/setCode'; payload: { code: string[] } }

const initialState: State = {
    main: undefined,
    code: []
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'code/setMain':
            return { ...state, ...action.payload }
        case 'code/setCode':
            return { ...state, ...action.payload }
    }
    return state
}
