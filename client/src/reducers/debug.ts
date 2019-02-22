import axios from 'axios'
import { Reducer } from 'redux'
import { serverAddress } from '../server'
import { ThunkAction, ThunkDispatch } from './Store'


export type State = {
    readonly debugging: boolean
    readonly fetching: boolean
    readonly results: unknown[]
    readonly error?: string
}
export type Action =
    { type: 'debug/start', payload?: { results: unknown[] }, error?: string } |
    { type: 'debug/stop', payload?: {}, error?: string } |
    { type: 'debug/input', payload?: {}, error?: string } |
    { type: 'debug/breakpoints', payload?: {}, error?: string } |
    { type: 'debug/step', payload?: { results: unknown[] }, error?: string }

const initialState: State = {
    debugging: false,
    fetching: false,
    results: [],
    error: undefined
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    if (!action) return state
    switch (action.type) {
        case 'debug/start':
            return !action.payload && !action.error
                ? { ...initialState, debugging: true, fetching: true }
                : action.payload
                    ? { ...state, fetching: false, results: action.payload.results }
                    : { ...state, debugging: false, fetching: false, error: action.error }
        case 'debug/stop':
            return !action.payload && !action.error
                ? { ...state, debugging: true, fetching: true }
                : action.payload
                    ? { ...state, debugging: false, fetching: false }
                    : { ...state, debugging: false, fetching: false, error: action.error }
        case 'debug/input':
            break
        case 'debug/step':
            // TODO check when debug ends
            return !action.payload && !action.error
                ? { ...state, fetching: true }
                : action.payload
                    ? { ...state, fetching: false, results: [...state.results, ...action.payload.results] }
                    : { ...state, debugging: false, fetching: false, error: action.error }

        case 'debug/breakpoints':
            break
    }
    return state
}

export function start(): ThunkAction {
    return async (dispatch, getState) => {
        dispatch<Action>({ type: 'debug/start' })
        try {
            const codeState = getState().code
            await axios.post(
                `${serverAddress}/tracers/create`,
                { supplier: codeState.language, code: codeState.text.join('\n') },
                { withCredentials: true }
            )
            const response = await axios.post(
                `${serverAddress}/tracers/execute`, { action: 'start', args: [] }, { withCredentials: true }
            )
            dispatch<Action>({ type: 'debug/start', payload: { results: response.data } })
        } catch (error) {
            dispatch<Action>({ type: 'debug/start', error: error.response ? error.response.data : error.toString() })
        }
    }
}

export function stop(): ThunkAction {
    return async dispatch => {
        dispatch<Action>({ type: 'debug/stop' })
        try {
            await axios.post(
                `${serverAddress}/tracers/execute`, { action: 'stop', args: [] }, { withCredentials: true }
            )
            dispatch<Action>({ type: 'debug/stop', payload: {} })
        } catch (error) {
            dispatch<Action>({ type: 'debug/stop', error: error.response ? error.response.data : error.toString() })
        }
    }
}

export function step(action: 'step' | 'stepOver' | 'stepOut' | 'continue'): ThunkAction {
    return async dispatch => {
        dispatch<Action>({ type: 'debug/step' })
        try {
            const response = await axios.post(
                `${serverAddress}/tracers/execute`, { action, args: [] }, { withCredentials: true }
            )
            dispatch<Action>({ type: 'debug/step', payload: { results: response.data } })
        } catch (error) {
            dispatch<Action>({ type: 'debug/step', error: error.response ? error.response.data : error.toString() })
        }

    }
}

// 'input'
// 'getBreakpoints'
// 'setBreakpoints'
