import { Reducer } from 'redux'
import { AsyncAction } from '../Store'

type State = number

type Action = { type: 'debug/reference/set'; payload: number }

const initialState: State = 0

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'debug/reference/set':
            return action.payload
    }
    return state
}

function set(index: number): AsyncAction {
    return async (dispatch, getState) => {
        const { debugResponse } = getState()
        dispatch({ type: 'debug/reference/set', payload: Math.max(0, Math.min(index, debugResponse.steps.length - 1)) })
    }
}

export const actions = { set }
