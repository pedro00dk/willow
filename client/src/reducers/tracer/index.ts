/**
 * Index reducer manages tracer steps.
 */
import * as tracer from '../../types/tracer'
import { DefaultAsyncAction } from '../Store'

type State = number

type Action = { type: 'tracer/index/set'; payload: number }

const initialState: State = 0

export const reducer = (state: State = initialState, action: Action): State =>
    action.type === 'tracer/index/set' ? action.payload : state

const setIndex = (index: number): DefaultAsyncAction => async (dispatch, getState) => {
    const tracer = getState().tracer
    if (!tracer.available) index = 0
    else index = Math.min(Math.max(index, 0), tracer.steps.length - 1)
    dispatch({ type: 'tracer/index/set', payload: index })
}

const stepIndex = (direction: '->' | '<-', type: 'v' | '-' | '^'): DefaultAsyncAction => async (dispatch, getState) => {
    const currentIndex = getState().index
    const tracer = getState().tracer
    if (!tracer.available) return dispatch(setIndex(0))
    const currentSnapshot = tracer.steps[currentIndex].snapshot

    const directionFilter = (index: number) => (direction === '->' ? index > currentIndex : index < currentIndex)

    const typeFilter = (step: tracer.Step) => {
        if (!currentSnapshot || !step.snapshot || type === 'v') return true
        const currentStackLength = currentSnapshot.stack.length
        const stackLength = step.snapshot.stack.length
        return type === '-' ? stackLength <= currentStackLength : stackLength < currentStackLength
    }

    const indices = tracer.steps
        .map((step, i) => ({ step, i }))
        .filter(({ step, i }) => directionFilter(i) && typeFilter(step))
        .map(({ i }) => i)
    const index = indices[direction === '->' ? 0 : indices.length - 1] ?? currentIndex
    dispatch({ type: 'tracer/index/set', payload: index })
}

export const actions = { setIndex, stepIndex }
