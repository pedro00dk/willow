import { Reducer } from 'redux'
import * as protocol from '../../protobuf/protocol'

type State = {
    readonly responses: protocol.ITracerResponse[]
    readonly steps: { frame: protocol.IFrame; prints: string[] }[]
    readonly lines: { [line: number]: number[] }
    readonly locked: protocol.Event.ILocked
    readonly threw: protocol.Event.IThrew
}

type Action = { type: 'debug/response/set'; payload: State }

const initialState: State = {
    responses: [],
    steps: [],
    lines: {},
    locked: undefined,
    threw: undefined
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'debug/response/set':
            return { ...state, ...action.payload }
    }
    return state
}

function set(responses: protocol.ITracerResponse[]): Action {
    const steps: State['steps'] = []
    const lines: State['lines'] = []
    let locked: State['locked']
    let threw: State['threw']
    let prints: string[] = []
    responses
        .flatMap(response => response.events)
        .forEach(event => {
            if (!!event.locked) return (locked = event.locked)
            if (!!event.threw) return (threw = event.threw)
            if (!!event.printed) return prints.push(event.printed.value)
            if (!event.inspected) return
            const frame = event.inspected.frame
            const line = frame.line
            if (!lines[line]) lines[line] = []
            const step = { frame, prints }
            prints = []
            const index = steps.push(step) - 1
            lines[line].push(index)
        })
    if (prints.length > 0) {
        const lastStep = steps[steps.length - 1]
        const line = !!lastStep ? lastStep.frame.line : 0
        const step = { frame: lastStep.frame, prints }
        const index = steps.push(step) - 1
        lines[line].push(index)
    }
    return { type: 'debug/response/set', payload: { responses, steps, lines, locked, threw } }
}

export const actions = { set }
