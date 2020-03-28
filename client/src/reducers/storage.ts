import { api, apiUrl } from '../api'
import { RequestAction, Program, User } from '../types/model'
import { actions as storeActions, DefaultAsyncAction } from './Store'

/**
 * User reducer updates the user information and collect user actions.
 */
type State = {
    initialized: boolean
}

type Action = { type: 'storage/init' }

const initialState: State = {
    initialized: false
}

export const reducer = (state: State = initialState, action: Action): State =>
    action.type === 'storage/init' ? { initialized: true } : state

const storage = (): DefaultAsyncAction => async (dispatch, getState) => {
    await dispatch(retrieve())
    await dispatch(persist())
}

const retrieve = (): DefaultAsyncAction => async dispatch => {
    dispatch(storeActions.input.set((sessionStorage.getItem('input') ?? '').split('\n')), false)
    dispatch(storeActions.source.set((sessionStorage.getItem('source') ?? '').split('\n')), false)
    dispatch(storeActions.language.select(parseInt(sessionStorage.getItem('language')) || 0), false)
    const rawOptions = JSON.parse(sessionStorage.getItem('options'))
    dispatch(storeActions.options.set(rawOptions ? JSON.parse(rawOptions) : {}))
}

const persist = (): DefaultAsyncAction => async (dispatch, getState) => {
    const initialized = getState().storage.initialized
    if (initialized) return
    dispatch({ type: 'storage/init' })
    setInterval(async () => {
        const { input, source, language, options } = getState()
        localStorage.setItem('input', input.join('\n'))
        localStorage.setItem('source', source.join('\n'))
        localStorage.setItem('language', language.selected.toString())
        localStorage.setItem('options', JSON.stringify(options))
    }, 5000)
}

export const actions = { storage }
