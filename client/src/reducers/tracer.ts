import { api } from '../api'
import * as schema from '../schema/schema'
import { DefaultAsyncAction } from './Store'

type State = {
    fetching: boolean
    index?: number
    steps?: schema.Step[]
    error?: string
}

type Action =
    | { type: 'tracer/trace'; payload?: { steps: schema.Step[] }; error?: string }
    | { type: 'tracer/setIndex'; payload: number }

const initialState: State = {
    fetching: false
}

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case 'tracer/trace':
            return action.payload
                ? { ...state, fetching: false, index: 0, ...action.payload }
                : action.error
                ? { ...initialState, error: action.error }
                : { ...initialState, fetching: true }
        case 'tracer/setIndex':
            return { ...state, index: action.payload }
        default:
            return state
    }
}

const trace = (): DefaultAsyncAction => async (dispatch, getState) => {
    dispatch({ type: 'tracer/trace' })
    try {
        const { language, source, input } = getState()
        const result = (
            await api.post<schema.Result>('/trace', {
                language: language.languages[language.selected],
                source: source.join('\n'),
                input: input.join('\n')
            })
        ).data
        dispatch({ type: 'tracer/trace', payload: { steps: result.steps } })
    } catch (error) {
        dispatch({ type: 'tracer/trace', error: error.response ? error.response.data : error.toString() })
    }
}

const setIndex = (index: number): DefaultAsyncAction => async (dispatch, getState) => {
    const tracer = getState().tracer
    if (!tracer.steps) return
    dispatch({ type: 'tracer/setIndex', payload: Math.min(Math.max(index, 0), tracer.steps.length - 1) })
}

const stepIndex = (direction: 'forward' | 'backward', type: 'into' | 'over' | 'out'): DefaultAsyncAction =>
    //
    async (dispatch, getState) => {
        const tracer = getState().tracer
        if (!tracer.steps) return
        const currentSnapshot = tracer.steps[tracer.index].snapshot

        const directionFilter = (index: number) =>
            direction === 'forward' ? index > tracer.index : index < tracer.index
        const typeFilter = (step: schema.Step) =>
            !currentSnapshot || !step.snapshot || type === 'into'
                ? true
                : type === 'over'
                ? step.snapshot.stack.length <= currentSnapshot.stack.length
                : type === 'out'
                ? step.snapshot.stack.length < currentSnapshot.stack.length
                : false

        const indices = tracer.steps
            .map((step, i) => ({ step, i }))
            .filter(({ step, i }) => directionFilter(i) && typeFilter(step))
            .map(({ i }) => i)
        const index = indices[direction === 'forward' ? 0 : indices.length - 1] ?? tracer.index
        return dispatch({ type: 'tracer/setIndex', payload: index })
    }

export const actions = { trace, setIndex, stepIndex }
