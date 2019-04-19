import { Reducer } from 'redux'
import { serverApi } from '../server'
import { AsyncAction } from './Store'

type State = {
    readonly session: string
    readonly fetching: boolean
    readonly error: string
}

type Action = { type: 'session/fetch'; payload?: { session: string }; error?: string }

const initialState: State = {
    session: undefined,
    fetching: false,
    error: undefined
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    console.log('action', action)
    switch (action.type) {
        case 'session/fetch':
            if (!!action.payload) return { ...state, fetching: false, session: action.payload.session }
            if (!!action.error) return { ...state, fetching: false, error: action.error }
            return { ...initialState, fetching: true }
    }
    return state
}

const fetch = (): AsyncAction => async dispatch => {
    dispatch({ type: 'session/fetch' })
    try {
        const session = (await serverApi.get('/session')).data as string
        dispatch({ type: 'session/fetch', payload: { session } })
    } catch (error) {
        dispatch({ type: 'session/fetch', error: !!error.response ? error.response.data : error.toString() })
    }
}

export const actions = { fetch }
