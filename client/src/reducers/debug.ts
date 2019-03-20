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
          payload?: { responses: protocol.ITracerResponse[] }
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
            if (!!action.payload) {
                const lastEvent = action.payload.response.events[action.payload.response.events.length - 1]
                const finished = !!lastEvent.threw || (!!lastEvent.inspected && lastEvent.inspected.frame.finish)
                return { ...state, debugging: !finished, fetching: false, responses: [action.payload.response] }
            }
            if (!!action.error) return { ...state, debugging: false, fetching: false, error: action.error }
            return { ...initialState, debugging: true, fetching: true }
        case 'debug/stop':
            if (!!action.payload) return { ...state, debugging: false, fetching: false }
            if (!!action.error) return { ...state, debugging: false, fetching: false, error: action.error }
            return { ...state, debugging: true, fetching: true }
        case 'debug/step':
            if (!!action.payload) {
                const lastResponse = action.payload.responses[action.payload.responses.length - 1]
                const lastEvent = lastResponse.events[lastResponse.events.length - 1]
                const finished = !!lastEvent.threw || (!!lastEvent.inspected && lastEvent.inspected.frame.finish)
                return {
                    ...state,
                    debugging: !finished,
                    fetching: false,
                    responses: [...state.responses, ...action.payload.responses]
                }
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
            const { code, language } = getState()
            const response = (await serverApi.post('/tracers/start', {
                language: language.selected,
                main: code.main,
                code: code.code.join('\n')
            })).data as protocol.ITracerResponse
            dispatch({ type: 'debug/start', payload: { response } })
            response.events
                .filter(event => !!event.printed)
                .forEach(event => dispatch({ type: 'io/appendOutput', payload: { output: event.printed.value } }))
            const lastEvent = response.events[response.events.length - 1]
            if (!!lastEvent.threw)
                dispatch({ type: 'io/appendOutput', payload: { output: lastEvent.threw.exception.traceback } })
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
                | { responses: protocol.ITracerResponse[] }

            const responseAsSingle = (response: any): response is protocol.ITracerResponse => {
                return !!(response as protocol.ITracerResponse).events
            }

            const responses = responseAsSingle(response) ? [response] : response.responses
            responses.forEach(response => {
                response.events
                    .filter(event => !!event.printed)
                    .forEach(event => dispatch({ type: 'io/appendOutput', payload: { output: event.printed.value } }))
                const lastEvent = response.events[response.events.length - 1]
                if (!!lastEvent.threw)
                    dispatch({ type: 'io/appendOutput', payload: { output: lastEvent.threw.exception.traceback } })
            })
            dispatch({ type: 'debug/step', payload: { responses } })
        } catch (error) {
            dispatch({ type: 'debug/step', error: !!error.response ? error.response.data : error.toString() })
        }
    }
}

// // 'input'
// // 'getBreakpoints'
// // 'setBreakpoints'
