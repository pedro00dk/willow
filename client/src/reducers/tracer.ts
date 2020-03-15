/**
 * Tracer reducer updates the state that stores the result of a tracing process and keep track of the tracing index.
 */
import { api } from '../api'
import { ClientRequest } from '../types/model'
import * as tracer from '../types/tracer'
import { DefaultAsyncAction } from './Store'

type State = {
    fetching: boolean
    available: boolean
    index: number
    response: tracer.Response
    steps: tracer.Step[]
    error?: string
}

type Action =
    | { type: 'tracer/trace'; payload?: tracer.Response; error?: string }
    | { type: 'tracer/setIndex'; payload: number }

const initialState: State = {
    fetching: false,
    available: false,
    index: 0,
    response: undefined,
    steps: []
}

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case 'tracer/trace':
            return action.payload
                ? { ...initialState, available: true, response: action.payload, steps: action.payload.steps }
                : action.error != undefined
                ? { ...initialState, error: action.error }
                : { ...initialState, fetching: true }
        case 'tracer/setIndex':
            return { ...state, index: action.payload }
        default:
            return state
    }
}

const trace = (): DefaultAsyncAction =>
    //
    async (dispatch, getState) => {
        dispatch({ type: 'tracer/trace' })
        try {
            const { language, source, input } = getState()
            const request: ClientRequest = {
                language: language.languages[language.selected],
                source: source.content.join('\n'),
                input: input.content.join('\n')
            }
            const response = (await api.post<tracer.Response>('/api/tracer/trace', request)).data
            dispatch({ type: 'tracer/trace', payload: response })
        } catch (error) {
            dispatch({ type: 'tracer/trace', error: error.response ? error.response.data : error.toString() })
        }
    }

const setIndex = (index: number): DefaultAsyncAction =>
    //
    async (dispatch, getState) => {
        const tracer = getState().tracer
        if (!tracer.steps) return
        dispatch({ type: 'tracer/setIndex', payload: Math.min(Math.max(index, 0), tracer.steps.length - 1) })
    }

const stepIndex = (direction: 'forward' | 'backward', type: 'into' | 'over' | 'out'): DefaultAsyncAction =>
    //
    async (dispatch, getState) => {
        const tracer = getState().tracer
        if (!tracer.available) return
        const snapshot = tracer.steps[tracer.index].snapshot

        const directionFilter = (index: number) =>
            direction === 'forward' ? index > tracer.index : index < tracer.index

        const typeFilter = (step: tracer.Step) =>
            !snapshot || !step.snapshot || type === 'into'
                ? true
                : type === 'over'
                ? step.snapshot.stack.length <= snapshot.stack.length
                : type === 'out'
                ? step.snapshot.stack.length < snapshot.stack.length
                : false

        const indices = tracer.steps
            .map((step, i) => ({ step, i }))
            .filter(({ step, i }) => directionFilter(i) && typeFilter(step))
            .map(({ i }) => i)
        const index = indices[direction === 'forward' ? 0 : indices.length - 1] ?? tracer.index
        return dispatch({ type: 'tracer/setIndex', payload: index })
    }

export const actions = { trace, setIndex, stepIndex }
