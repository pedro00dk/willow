import { Reducer } from 'redux'

export enum MarkerType {
    HIGHLIGHT,
    WARNING,
    ERROR
}

type State = {
    readonly markers: ReadonlySet<{ line: number; type: MarkerType }>
}

type Action = { type: 'marker/set'; payload: { markers: { line: number; type: MarkerType }[] } }

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

const set = (markers: { line: number; type: MarkerType }[]): Action => ({ type: 'marker/set', payload: { markers } })

export const actions = { set }
