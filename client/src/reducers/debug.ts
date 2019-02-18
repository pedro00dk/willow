import axios from 'axios'
import { Reducer } from 'redux'
import { serverAddress } from '../server'
import { ThunkDispatch } from './Store'


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
    { type: 'debug/step', payload: { results: unknown[] }, error?: string } |
    { type: 'debug/stepOver', payload: { results: unknown[] }, error?: string } |
    { type: 'debug/stepOut', payload: { results: unknown[] }, error?: string } |
    { type: 'debug/continue', payload: { results: unknown[] }, error?: string }

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
        case 'debug/breakpoints':
        case 'debug/step':
        case 'debug/stepOver':
        case 'debug/stepOut':
        case 'debug/continue':
    }
    return state
}

export function start(supplier: string, code: string) {
    return async (dispatch: ThunkDispatch) => {
        dispatch<Action>({ type: 'debug/start' })
        try {
            await axios.post(`${serverAddress}/tracers/create`, { supplier, code }, { withCredentials: true })
            const startResult = await axios.post(
                `${serverAddress}/tracers/execute`, { action: 'start', args: [] }, { withCredentials: true }
            )
            dispatch<Action>({ type: 'debug/start', payload: { results: startResult.data } })
        } catch (error) {
            dispatch<Action>({ type: 'debug/start', error: error.response ? error.response.data : error.toString() })
        }
    }
}

export function stop() {
    return async (dispatch: ThunkDispatch) => {
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
