/**
 * Tracer reducer updates the state that stores the result of a tracing process and keep track of the tracing index.
 */
import { api } from '../../api'
import { ClientRequest } from '../../types/model'
import * as tracer from '../../types/tracer'
import { DefaultAsyncAction } from '../Store'
import { actions as storeActions } from '../Store'

type State = {
    fetching: boolean
    status: { mode: 'download' | 'upload'; progress: number }
    response: tracer.Response
    steps: tracer.Step[]
    available: boolean
}

type Action =
    | { type: 'tracer/trace'; payload?: tracer.Response; error?: string }
    | { type: 'tracer/status'; payload: State['status'] }
    | { type: 'tracer/available' }

const initialState: State = {
    fetching: false,
    status: { mode: 'upload', progress: 0 },
    response: undefined,
    steps: undefined,
    available: false
}

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case 'tracer/trace':
            return action.payload
                ? { ...initialState, response: action.payload, steps: action.payload.steps }
                : action.error
                ? { ...initialState }
                : { ...initialState, fetching: true }
        case 'tracer/status':
            return { ...state, status: action.payload }
        case 'tracer/available':
            return { ...state, available: true }
        default:
            return state
    }
}

const trace = (): DefaultAsyncAction => async (dispatch, getState) => {
    dispatch({ type: 'tracer/trace' })
    try {
        const { language, source, input, options } = getState()
        const request: ClientRequest = {
            language: language.languages[language.selected],
            source: source.join('\n'),
            input: input.join('\n')
        }
        const onProgress = (progressEvent: any) => console.log(progressEvent)
        const response = (
            await api.post<tracer.Response>('/api/tracer/trace', request, {
                onUploadProgress: onProgress,
                onDownloadProgress: onProgress
            })
        ).data
        dispatch({ type: 'tracer/trace', payload: response }, false)
        dispatch({ type: 'tracer/available' }, false)
        await dispatch(storeActions.index.setIndex(options.enableVisualization ? 0 : Infinity), false)
        await dispatch(storeActions.output.compute(), false)
        dispatch({ type: 'tracer/available' })
    } catch (error) {
        dispatch({ type: 'tracer/trace', error: error.response ? error.response.data : error.toString() })
    }
}

export const actions = { trace }
