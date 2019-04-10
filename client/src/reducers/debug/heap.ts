import { Reducer } from 'redux'
import { AsyncAction } from '../Store'

type State = {
    heap: {}
}

type Action = { type: 'debug/heap/loadHeap'; payload: State }

const initialState: State = {
    heap: undefined
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'debug/heap/loadHeap':
            return { ...state, ...action.payload }
    }
    return state
}

function loadGraph(): AsyncAction {
    return async (dispatch, getState) => {
        const { debugResponse } = getState()
        debugResponse.steps.forEach((step, i) => {
            const frame = step.frame
            console.log(frame.heap.references)
        })
        dispatch({ type: 'debug/heap/loadHeap', payload: undefined })
    }
}

export const actions = { loadGraph }
