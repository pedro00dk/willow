/**
 * Output reducer computes the outputs at each step of the tracer reducer.
 */
import { DefaultAsyncAction } from '../Store'

type State = string[]

type Action = { type: 'output/compute'; payload: string[] }

const initialState: State = []

export const reducer = (state: State = initialState, action: Action): State =>
    action.type === 'output/compute' ? action.payload : state

const compute = (): DefaultAsyncAction => async (dispatch, getState) => {
    const tracer = getState().tracer
    const output = (tracer.steps ?? []).reduce<string[]>((acc, step) => {
        const previousContent = acc[acc.length - 1] ?? ''
        const error = step.error?.exception?.traceback ?? step.error?.cause ?? ''
        const print = step.print ?? ''
        acc.push(`${previousContent}${error}${print}`)
        return acc
    }, [])
    dispatch({ type: 'output/compute', payload: output })
}

export const actions = { compute }
