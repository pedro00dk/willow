import { Reducer } from 'redux'
import * as protocol from '../../protobuf/protocol'
import { serverApi } from '../../server'
import { AsyncAction } from '../Store'
import { actions as debugHeapActions } from './heap'
import { actions as debugIndexerActions } from './indexer'
import { actions as debugResultActions } from './result'
import { actions as debugStackActions } from './stack'

type State = {
    readonly fetching: boolean
    readonly error?: string
}

type Action = { type: 'debug/interface/trace'; payload?: {}; error?: string }

const initialState: State = {
    fetching: false,
    error: undefined
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'debug/interface/trace':
            if (!!action.payload) return { ...state, fetching: false }
            if (!!action.error) return { ...state, fetching: false, error: action.error }
            return { ...initialState, fetching: true }
    }
    return state
}

function inspect(): AsyncAction {
    return async (dispatch, getState) => {
        dispatch({ type: 'debug/interface/trace' })
        try {
            const { code, input, language } = getState()
            const result = (await serverApi.post<protocol.IResult>('/tracer/trace', {
                language: language.languages[language.selected],
                source: code.join('\n'),
                input: input.join('\n')
            })).data
            dispatch({ type: 'debug/interface/trace', payload: {} })
            dispatch(debugIndexerActions.set(0))
            dispatch(debugResultActions.set(result))
            dispatch(debugHeapActions.loadGraph())
            dispatch(debugStackActions.load())
        } catch (error) {
            dispatch({
                type: 'debug/interface/trace',
                error: !!error.response ? error.response.data : error.toString()
            })
        }
    }
}

export const actions = { inspect }
