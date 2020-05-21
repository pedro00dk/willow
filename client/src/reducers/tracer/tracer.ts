/**
 * Tracer reducer updates the state that stores the result of a tracing process and keep track of the tracing index.
 */
import axios from 'axios'
import * as tracer from '../../types/tracer'
import { Request } from '../../types/tracer'
import { actions as storeActions, DefaultAsyncAction } from '../Store'

type State = {
    fetching: boolean
    status: { phase: 'download' | 'upload'; progress: number }
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
    status: { phase: 'upload', progress: 0 },
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
        const { language, source, input, options, user } = getState()
        const tracerUrl = language.languages[language.selected]

        const request: Request = {
            source: source.content.join('\n'),
            input: input.content.join('\n'),
            steps: user.user ? 1000 : 400
        }
        const onProgress = (event: ProgressEvent) => {
            const phase = event.target instanceof XMLHttpRequestUpload ? 'upload' : 'download'
            const progress = event.loaded / event.total
            dispatch({ type: 'tracer/status', payload: { phase, progress } })
        }
        const startTime = Date.now()
        const response = (
            await axios.post<tracer.Response>(tracerUrl, request, {
                onUploadProgress: onProgress,
                onDownloadProgress: onProgress
            })
        ).data
        const elapsedTime = Date.now() - startTime
        const compilationError = response.steps.length === 1 && !!response.steps[0].error
        const runtimeError = response.steps.length > 1 && !!response.steps[response.steps.length - 1].error
        const action = { request, elapsedTime, compilationError, runtimeError }
        dispatch({ type: 'tracer/trace', payload: response }, false)
        dispatch({ type: 'tracer/available' }, false)
        dispatch(storeActions.user.action({ name: 'trace', payload: action }))
        await dispatch(storeActions.index.set(options.visualization ? 0 : Infinity), false)
        await dispatch(storeActions.output.compute(), false)
        dispatch({ type: 'tracer/available' })
    } catch (error) {
        dispatch({ type: 'tracer/trace', error: error.response ? error.response.data : error.toString() })
    }
}

export const actions = { trace }
