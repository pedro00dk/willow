import { Reducer } from 'redux'
import * as protocol from '../../protobuf/protocol'

type State = {
    readonly steps: protocol.IStep[]
    readonly lines: { [line: number]: number[] }
}

type Action = { type: 'debug/result/set'; payload: State }

const initialState: State = {
    steps: [],
    lines: {}
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'debug/result/set':
            return { ...state, ...action.payload }
    }
    return state
}

function set(result: protocol.IResult): Action {
    const steps = result.steps
    const lines: State['lines'] = []
    result.steps.forEach((step, i) => {
        if (!step.snapshot) return
        const line = step.snapshot.stack[step.snapshot.stack.length - 1].line
        if (!lines[line]) lines[line] = []
        lines[line].push(i)
    })
    return { type: 'debug/result/set', payload: { steps, lines } }
}

export const actions = { set }
