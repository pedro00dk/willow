import axios from 'axios'
import { Reducer } from 'redux'
import { serverAddress } from '../server'
import { ThunkAction, ThunkDispatch } from './Store'


export type State = {
    readonly session: string
    readonly fetching: boolean
    readonly failed: boolean
}
export type Action = { type: 'session/fetch', payload?: { session: string }, error?: string }

const initialState: State = {
    session: undefined,
    fetching: false,
    failed: false
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    if (!action) return state
    switch (action.type) {
        case 'session/fetch':
            return !action.payload && !action.error
                ? { ...state, fetching: true, error: false }
                : action.payload
                    ? { ...state, session: action.payload.session, fetching: false, failed: false }
                    : { ...state, fetching: false, failed: true }
    }
    return state
}

export function fetch(): ThunkAction {
    return async dispatch => {
        dispatch<Action>({ type: 'session/fetch' })
        try {
            const session = (await axios.get(`${serverAddress}/session`, { withCredentials: true }))
            dispatch<Action>({ type: 'session/fetch', payload: { session: session.data.session } })
        } catch (error) {
            dispatch<Action>({ type: 'session/fetch', error: error.message })
        }
    }
}
