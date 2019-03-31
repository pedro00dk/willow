import { Reducer } from 'redux'

type State = {
    readonly main: string
    readonly code: string[]
}

type Action =
    | { type: 'code/setCode'; payload: { code: string[] } }
    | { type: 'code/setMain'; payload: { main: string } }

const initialState: State = {
    main: undefined,
    code: []
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'code/setCode':
            return { ...state, ...action.payload }
        case 'code/setMain':
            return { ...state, ...action.payload }
    }
    return state
}

const set = (code: string[]): Action => ({ type: 'code/setCode', payload: { code } })

const setMain = (main: string): Action => ({ type: 'code/setMain', payload: { main } })

export const actions = { set, setMain }
