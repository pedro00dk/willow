import { Reducer } from 'redux'
import * as protocol from '../protobuf/protocol'
import { serverApi } from '../server'
import { AsyncAction } from './Store'

type State = {
    readonly debugging: boolean
    readonly fetching: boolean
    readonly responses: protocol.ITracerResponse[]
    readonly error?: string
}

type Action =
    | { type: 'debug/start'; payload?: { response: protocol.ITracerResponse }; error?: string }
    | { type: 'debug/stop'; payload?: {}; error?: string }
    | { type: 'debug/step'; payload?: { responses: protocol.ITracerResponse[] }; error?: string }
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

const start = (): AsyncAction => {
    return async (dispatch, getState) => {
        dispatch({ type: 'debug/start' })
        try {
            const { code, language } = getState()
            const response = (await serverApi.post('/tracers/start', {
                language: language.languages[language.selected],
                main: code.main,
                code: code.code.join('\n')
            })).data as protocol.ITracerResponse
            dispatch({ type: 'debug/start', payload: { response } })
        } catch (error) {
            dispatch({ type: 'debug/start', error: !!error.response ? error.response.data : error.toString() })
        }
    }
}

const stop = (): AsyncAction => {
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

const step = (action: 'step' | 'stepOver' | 'stepOut' | 'continue'): AsyncAction => {
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
            dispatch({ type: 'debug/step', payload: { responses } })
        } catch (error) {
            dispatch({ type: 'debug/step', error: !!error.response ? error.response.data : error.toString() })
        }
    }
}

const setBreakpoints = (): AsyncAction => {
    return async (dispatch, getState) => {
        dispatch({ type: 'debug/setBreakpoints' })
        try {
            const { breakpoints } = getState()
            await serverApi.post(`/tracers/setBreakpoints`, [...breakpoints.lines])
            dispatch({ type: 'debug/setBreakpoints', payload: {} })
        } catch (error) {
            dispatch({ type: 'debug/setBreakpoints', error: !!error.response ? error.response.data : error.toString() })
        }
    }
}

// 'input'

export const actions = { start, stop, step, setBreakpoints }
