import { Reducer } from 'redux'
import * as protocol from '../../protobuf/protocol'
import { serverApi } from '../../server'
import { AsyncAction } from '../Store'
import { actions as debugHeapActions } from './heap'
import { actions as debugReferenceActions } from './reference'
import { actions as debugResponseActions } from './response'
import { actions as debugStackActions } from './stack'

type State = {
    readonly fetching: boolean
    readonly stopped: boolean
    readonly error?: string
}

type Action =
    | { type: 'debug/interface/inspect'; payload?: {}; error?: string }
    | { type: 'debug/interface/forceStop'; payload?: {}; error?: string }

const initialState: State = {
    fetching: false,
    stopped: false,
    error: undefined
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'debug/interface/inspect':
            if (!!action.payload) return { ...state, fetching: false }
            if (!!action.error) return { ...state, fetching: false, error: action.error }
            return { ...initialState, fetching: true }
        case 'debug/interface/forceStop':
            if (!!action.payload) return { ...state, fetching: false, stopped: true }
            if (!!action.error) return { ...state, fetching: false, stopped: true, error: action.error }
            return { ...state, fetching: true }
    }
    return state
}

function inspect(): AsyncAction {
    return async (dispatch, getState) => {
        dispatch({ type: 'debug/interface/inspect' })
        try {
            const { code, input, language } = getState()
            const startResponse = (await serverApi.post('/tracers/start', {
                language: language.languages[language.selected],
                code: code.join('\n')
            })).data as protocol.ITracerResponse

            const responses = [startResponse]
            let lastResponse = responses[responses.length - 1]
            let lastEvent = lastResponse.events[lastResponse.events.length - 1]
            let finished = !!lastEvent.threw || (!!lastEvent.inspected && lastEvent.inspected.frame.finish)
            if (!finished) {
                await serverApi.post(`/tracers/input`, [...input])
                const continueResponses = (await serverApi.post('/tracers/continue')).data as {
                    responses: protocol.ITracerResponse[]
                }
                responses.push(...continueResponses.responses)
            }
            lastResponse = responses[responses.length - 1]
            lastEvent = lastResponse.events[lastResponse.events.length - 1]
            finished = !!lastEvent.threw || (!!lastEvent.inspected && lastEvent.inspected.frame.finish)
            if (!finished) await serverApi.post('/tracers/stop')
            dispatch({ type: 'debug/interface/inspect', payload: { finished } })
            dispatch(debugResponseActions.set(responses))
            dispatch(debugReferenceActions.set(0))
            dispatch(debugHeapActions.loadGraph())
            dispatch(debugStackActions.loadStack())
        } catch (error) {
            dispatch({
                type: 'debug/interface/inspect',
                error: !!error.response ? error.response.data : error.toString()
            })
        }
    }
}

function forceStop(): AsyncAction {
    return async dispatch => {
        dispatch({ type: 'debug/interface/forceStop' })
        try {
            await serverApi.post('/tracers/stop')
            dispatch({ type: 'debug/interface/forceStop', payload: {} })
        } catch (error) {
            dispatch({
                type: 'debug/interface/forceStop',
                error: !!error.response ? error.response.data : error.toString()
            })
        }
    }
}

export const actions = { inspect, forceStop }
