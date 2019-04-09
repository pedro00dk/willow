import { Reducer } from 'redux'
import * as protocol from '../../protobuf/protocol'

type State = {
    readonly responses: protocol.ITracerResponse[]
    readonly frames: protocol.IFrame[]
    readonly prints: string[]
    readonly order: (protocol.IFrame | string)[]
    readonly lines: { [line: number]: { frames: number[]; prints: number[] } }
    readonly locked: protocol.Event.ILocked
    readonly threw: protocol.Event.IThrew
}

type Action = { type: 'debug/response/set'; payload: State }

const initialState: State = {
    responses: [],
    frames: [],
    prints: [],
    order: [],
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
    const frames: State['frames'] = []
    const prints: State['prints'] = []
    const order: State['order'] = []
    const lines: State['lines'] = []
    let locked: State['locked']
    let threw: State['threw']
    const cache = { printsStack: [] as string[] }
    responses
        .flatMap(response => response.events)
        .forEach(event => {
            if (!!event.locked) return (locked = event.locked)
            if (!!event.threw) return (threw = event.threw)
            if (!!event.printed) return cache.printsStack.push(event.printed.value)
            if (!event.inspected) return
            const frame = event.inspected.frame
            if (!lines[frame.line]) lines[frame.line] = { frames: [], prints: [] }
            order.push(...cache.printsStack)
            order.push(frame)
            cache.printsStack.forEach(print => lines[frame.line].prints.push(prints.push(print) - 1))
            cache.printsStack = []
            lines[frame.line].frames.push(frames.push(frame) - 1)
        })
    if (cache.printsStack.length > 0) {
        const lastFrame = frames[frames.length - 1]
        order.push(...cache.printsStack)
        cache.printsStack.forEach(print => lines[lastFrame.line].prints.push(prints.push(print) - 1))
        cache.printsStack = []
    }
    return { type: 'debug/response/set', payload: { responses, frames, prints, order, lines, locked, threw } }
}

export const actions = { set }
