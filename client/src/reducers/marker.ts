import { Reducer } from 'redux'

export type MarkerLine = {
    line: number
    type: MarkerType
}

export enum MarkerType {
    HIGHLIGHT,
    WARNING,
    ERROR
}

type State = MarkerLine[]

type Action = { type: 'marker/set'; payload: MarkerLine[] }

const initialState: State = []

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'marker/set':
            return action.payload
    }
    return state
}

function set(markers: MarkerLine[]): Action {
    return { type: 'marker/set', payload: markers }
}

export const actions = { set }
