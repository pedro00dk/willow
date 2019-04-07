import { Reducer } from 'redux'

export enum MarkerType {
    HIGHLIGHT,
    WARNING,
    ERROR
}

type State = {
    readonly markers: ReadonlySet<{ line: number; type: MarkerType }>
}

type Action = { type: 'marker/set'; payload: { markers: (State['markers'] extends ReadonlySet<infer T> ? T : any)[] } }

const initialState: State = {
    markers: new Set()
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'marker/set':
            return { ...state, markers: new Set(action.payload.markers) }
    }
    return state
}

function set(markers: { line: number; type: MarkerType }[]): Action {
    return { type: 'marker/set', payload: { markers } }
}

export const actions = { set }
