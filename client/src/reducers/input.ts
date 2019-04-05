import { Reducer } from 'redux'

type State = {
    readonly lines: string[]
    readonly consumed: number
}

type Action =
    | { type: 'input/set'; payload: { lines: string[] } }
    | { type: 'input/consume'; payload: { consumed: number } }
    | { type: 'input/reset' }

const initialState: State = {
    lines: [],
    consumed: 0
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'input/set':
            return { ...state, ...action.payload }
        case 'input/consume':
            return { ...state, consumed: Math.min(state.consumed + action.payload.consumed, state.lines.length) }
        case 'input/reset':
            return { ...state, consumed: 0 }
    }
    return state
}

const set = (lines: string[]): Action => ({ type: 'input/set', payload: { lines } })

const consume = (consumed: number): Action => ({ type: 'input/consume', payload: { consumed } })

const reset = (): Action => ({ type: 'input/reset' })

export const actions = { set, consume, reset }
