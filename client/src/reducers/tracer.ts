import { Reducer } from 'redux'
import * as protocol from '../protobuf/protocol'
import { serverApi } from '../server'
import { AsyncAction } from './Store'
import { actions as visualizationActions } from './visualization'

type State = {
    readonly fetching: boolean
    readonly available: boolean
    readonly steps: protocol.IStep[]
    readonly output: string[]
    readonly lines: { [line: number]: number[] }
    readonly index: number
    readonly error: string
}

type Action =
    | {
          type: 'tracer/trace'
          payload?: { steps: protocol.IStep[]; output: string[]; lines: State['lines'] }
          error?: string
      }
    | { type: 'tracer/setIndex'; payload: { index: number } }

const initialState: State = {
    fetching: false,
    available: false,
    steps: [],
    output: [],
    lines: {},
    index: 0,
    error: undefined
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'tracer/trace':
            if (!!action.payload) return { ...state, fetching: false, available: true, ...action.payload }
            if (!!action.error) return { ...state, fetching: false, error: action.error }
            return { ...initialState, fetching: true }
        case 'tracer/setIndex':
            return { ...state, ...action.payload }
    }
    return state
}

const trace = (): AsyncAction => async (dispatch, getState) => {
    dispatch({ type: 'tracer/trace' })
    try {
        const { code, input, language } = getState()
        const result = (await serverApi.post<protocol.IResult>('/tracer/trace', {
            language: language.languages[language.selected],
            source: code.join('\n'),
            input: input.join('\n')
        })).data

        const steps = result.steps
        const output: string[] = []
        const lines: State['lines'] = []
        result.steps.forEach((step, i) => {
            const snapshot = step.snapshot
            const previousSnapshot = i !== 0 ? steps[i - 1].snapshot : undefined

            const currentOutput = i !== 0 ? output[i - 1] : ''
            const codePrints = step.prints.join('')
            const codeThrew =
                !!snapshot &&
                !!previousSnapshot &&
                snapshot.finish &&
                previousSnapshot.type === protocol.Snapshot.Type.EXCEPTION
                    ? previousSnapshot.exception.traceback.join('')
                    : ''
            const tracerThrew = !!step.threw
                ? !!step.threw.exception
                    ? step.threw.exception.traceback.join('')
                    : step.threw.cause
                : ''

            output[i] = `${currentOutput}${codePrints}${codeThrew}${tracerThrew}`

            if (!snapshot) return
            const line = snapshot.stack[snapshot.stack.length - 1].line
            if (!lines[line]) lines[line] = []
            lines[line].push(i)
        })
        dispatch(visualizationActions.load(steps))
        dispatch({ type: 'tracer/trace', payload: { steps, output, lines } })
    } catch (error) {
        dispatch({
            type: 'tracer/trace',
            error: !!error.response ? error.response.data : error.toString()
        })
    }
}

const setIndex = (index: number): AsyncAction => async (dispatch, getState) => {
    const { tracer } = getState()
    dispatch({ type: 'tracer/setIndex', payload: { index: Math.max(0, Math.min(index, tracer.steps.length - 1)) } })
}

export const actions = { trace, setIndex }
