import { Reducer } from 'redux'
import { AsyncAction } from '../Store'

type State = {
    heap: {}
}

type Action = { type: 'debug/heap/load'; payload: State }

const initialState: State = {
    heap: undefined
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'debug/heap/load':
            return { ...state, ...action.payload }
    }
    return state
}

function loadGraph(): AsyncAction {
    return async (dispatch, getState) => {
        const { debugResult } = getState()
        debugResult.steps.forEach((step, i) => console.log(step))
        dispatch({ type: 'debug/heap/load', payload: undefined })
    }
}

export const actions = { loadGraph }
