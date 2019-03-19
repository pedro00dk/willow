import { Reducer } from 'redux'
import * as protocol from '../protobuf/protocol'
import { serverApi } from '../server'
import { ThunkAction } from './Store'

type State = {
    readonly debugging: boolean
    readonly fetching: boolean
    readonly responses: protocol.ITracerResponse[]
    readonly error?: string
}

type Action =
    | { type: 'debug/start'; payload?: { response: protocol.ITracerResponse }; error?: string }
    | { type: 'debug/stop'; payload?: {}; error?: string }
    | {
          type: 'debug/step'
          payload?: { response: protocol.ITracerResponse | protocol.ITracerResponse[] }
          error?: string
      }
    | { type: 'debug/input'; payload?: {}; error?: string }
    | { type: 'debug/setBreakpoints'; payload?: {}; error?: string }

const initialState: State = {
    debugging: false,
    fetching: false,
    responses: [],
    error: undefined
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'debug/start':
            if (!!action.payload) return { ...state, fetching: false, responses: [action.payload.response] }
            if (!!action.error) return { ...state, debugging: false, fetching: false, error: action.error }
            return { ...initialState, debugging: true, fetching: true }
        case 'debug/stop':
            if (!!action.payload) return { ...state, debugging: false, fetching: false }
            if (!!action.error) return { ...state, debugging: false, fetching: false, error: action.error }
            return { ...state, debugging: true, fetching: true }
        case 'debug/step':
            if (!!action.payload) {
                const responses =
                    action.payload.response instanceof Array ? action.payload.response : [action.payload.response]
                return { ...state, fetching: false, responses: [...state.responses, ...responses] }
            }
            if (!!action.error) return { ...state, debugging: false, fetching: false, error: action.error }
            return { ...state, fetching: true }
        case 'debug/input':
            if (!!action.payload) return { ...state, fetching: false }
            if (!!action.error) return { ...state, debugging: false, fetching: false, error: action.error }
            return { ...state, fetching: true }
        case 'debug/setBreakpoints':
            if (!!action.payload) return { ...state, fetching: false }
            if (!!action.error) return { ...state, debugging: false, fetching: false, error: action.error }
            return { ...state, fetching: true }
    }
    return state
}

export function start(): ThunkAction {
    return async (dispatch, getState) => {
        dispatch({ type: 'debug/start' })
        try {
            const codeState = getState().code
            const response = (await serverApi.post('/tracers/start', {
                language: codeState.language,
                main: '<script>',
                code: codeState.text.join('\n')
            })).data as protocol.ITracerResponse
            dispatch({ type: 'debug/start', payload: { response } })
        } catch (error) {
            dispatch({ type: 'debug/start', error: !!error.response ? error.response.data : error.toString() })
        }
    }
}

export function stop(): ThunkAction {
    return async dispatch => {
        dispatch({ type: 'debug/stop' })
        try {
            await serverApi.post('/tracers/stop')
            dispatch({ type: 'debug/stop', payload: {} })
        } catch (error) {
            dispatch({ type: 'debug/stop', error: !!error.response ? error.response.data : error.toString() })
        }
    }
}

export function step(action: 'step' | 'stepOver' | 'stepOut' | 'continue'): ThunkAction {
    return async dispatch => {
        dispatch({ type: 'debug/step' })
        try {
            const response = (await serverApi.post(`/tracers/${action}`)).data as
                | protocol.ITracerResponse
                | protocol.ITracerResponse[]
            dispatch({ type: 'debug/step', payload: { response } })
        } catch (error) {
            dispatch({ type: 'debug/step', error: !!error.response ? error.response.data : error.toString() })
        }
    }
}

// // 'input'
// // 'getBreakpoints'
// // 'setBreakpoints'
