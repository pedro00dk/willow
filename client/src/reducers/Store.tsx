/**
 * Store implementation using flow principles for the React Hooks API.
 */
import React from 'react'
import { reducer as actionReducer } from './action'
import { reducer as debugReducer } from './debug'
import { reducer as inputReducer } from './input'
import { reducer as languageReducer } from './language'
import { reducer as optionsReducer } from './options'
import { reducer as sourceReducer } from './source'
import { reducer as outputReducer } from './tracer/output'
import { reducer as tracerReducer } from './tracer/tracer'
import { reducer as userReducer } from './user'

/**
 * Piece of a reducer.
 * States, Actions and Reducers declared in reducer files must be subtypes of the following types (not explicitly).
 * SubReducers implementations must always return a new object if the state changes, otherwise the current state.
 * If an unknown action is received, it must ignore then and return the current state.
 */
export type SubReducer = (state: any, action: { type?: string; payload?: any; error?: any }) => any

/**
 * Collection or reducers from different files in an object.
 * This collection is used for extended generic subtypes in following types, providing advanced completion.
 */
export type SubReducers = { [name: string]: SubReducer }

/**
 * Combined reducer.
 * The Reducer applies to the correct SubState piece in State the correct action and returns the updated state.
 * The State is the concatenation in an object of the extended SubReducers name and state.
 * The Action is the union of all extended SubReducers actions plus the empty action.
 */
export type Reducer<T extends SubReducers> = (state: State<T>, action: Action<T>) => State<T>
export type State<T extends SubReducers> = { [name in keyof T]: Parameters<T[name]>[0] }
export type Action<T extends SubReducers> = { [name in keyof T]: Parameters<T[name]>[1] }[keyof T] | {}

/**
 * Store contains the state and updates it thought reducers and dispatch calls.
 */
export type Store<T extends SubReducers> = {
    getState: GetState<T>
    dispatch: Dispatch<T>
    subscribe: (subscription: () => void) => () => void
}
export type GetState<T extends SubReducers> = () => State<T>
export type Dispatch<T extends SubReducers> = (action: Action<T> | AsyncAction<T>, call?: boolean) => Promise<void>

/**
 * Asynchronous action for store dispatch.
 * AsyncActions are functions that receive the dispatch function itself and the getState function as arguments.
 * These functions can be used to dispatch many synchronous or even other asynchronous actions.
 */
export type AsyncAction<T extends SubReducers> = (dispatch: Dispatch<T>, getState: GetState<T>) => Promise<void>

/**
 * Hooks to provide store state access to react components.
 * useDispatch is a hook that returns the dispatch function of the store, allowing components to dispatch actions.
 * useSelection allows the user to query pieces of the state and update the components of the pieces change.
 */
export type Hooks<T extends SubReducers> = {
    useDispatch: () => Dispatch<T>
    useSelection: <U>(query: (state: State<T>) => U) => U
}

/**
 * Combine an object containing SubReducers in a single reducer.
 * @param reducers object containing SubReducers
 */
const combineReducers = <T extends SubReducers>(reducers: T): Reducer<T> => (state, action) =>
    Object.fromEntries(Object.entries(reducers).map(([name, r]) => [name, r(state[name], action)])) as State<T>

/**
 * Create a store from the combined reducer and initializes the state.
 * @param reducer a combined reducer
 */
const createStore = <T extends SubReducers>(reducer: Reducer<T>): Store<T> => {
    let state = {} as State<T>
    const subscriptions = [] as (() => void)[]

    const getState = () => state.current

    const dispatch: Store<T>['dispatch'] = (action, call = true) => {
        if (typeof action === 'function') return action(dispatch, getState)
        state = reducer(state.current, action)
        if (call) subscriptions.forEach(subscription => subscription())
    }

    const subscribe = (subscription: () => void) => {
        subscriptions.push(subscription)
        return () => {
            const index = subscriptions.indexOf(subscription)
            index >= 0 && subscriptions.splice(index, 1)
        }
    }

    dispatch({})
    return { getState, dispatch, subscribe }
}

/**
 * Wrap the Store in a new closure to provide hooks that can be used by react components.
 * @param store store to provide hooks
 */
const createHooks = <T extends SubReducers>(store: Store<T>): Hooks<T> => {
    const areSelectionsEqual = (selectionA: any, selectionB: any) => {
        if (Object.is(selectionA, selectionB)) return true
        if (typeof selectionA !== typeof selectionB) return false
        if (typeof selectionA !== 'object') return selectionA === selectionB
        const keysA = Object.keys(selectionA)
        const keysB = Object.keys(selectionB)
        const equalsKeyLength = keysA.length === keysB.length
        return equalsKeyLength && keysA.reduce((acc, key) => acc && selectionA[key] === selectionB[key], true)
    }

    const useDispatch = () => store.dispatch

    const useSelection = <U extends any>(query: (state: State<T>) => U) => {
        const memoQuery = React.useCallback(query, [])
        const [selection, setSelection] = React.useState(() => memoQuery(store.getState()))
        const selectionRef = React.useRef(selection)

        React.useEffect(() => {
            const checkSelectionUpdate = () => {
                const updatedSelection = memoQuery(store.getState())
                const isPromise = typeof updatedSelection.then === 'function'
                const equals = isPromise || areSelectionsEqual(selectionRef.current, updatedSelection)
                if (!isPromise && !equals) setSelection((selectionRef.current = updatedSelection))
            }

            checkSelectionUpdate()
            const unsubscribe = store.subscribe(checkSelectionUpdate)
            return () => unsubscribe()
        }, [])

        return selection
    }

    return { useDispatch, useSelection }
}

/**
 * Compose the functions to create reducers, store and hooks.
 * @param reducers object containing SubReducers
 */
const reducersToHooks = <T extends SubReducers>(reducers: T) => createHooks(createStore(combineReducers(reducers)))

/**
 * React tree wrapper that provides the hooks context.
 * It creates a store from received reducers and propagates the store hooks through the received react context.
 */
export const Store = <T extends SubReducers>(props: {
    reducers: T
    context: React.Context<Hooks<T>>
    children?: React.ReactNode
}) => <props.context.Provider value={reducersToHooks(props.reducers)}>{props.children}</props.context.Provider>

// Default Store containing all reducer files

const reducers = {
    action: actionReducer,
    debug: debugReducer,
    input: inputReducer,
    language: languageReducer,
    options: optionsReducer,
    output: outputReducer,
    source: sourceReducer,
    tracer: tracerReducer,
    user: userReducer
}

type Reducers = typeof reducers
export type DefaultState = State<Reducers>
export type DefaultAsyncAction = AsyncAction<Reducers>

const context = React.createContext<Hooks<Reducers>>(undefined)

export const useDispatch = () => React.useContext(context).useDispatch()
export const useSelection = <U extends any>(query: (state: State<Reducers>) => U) =>
    React.useContext(context).useSelection(query)

export const DefaultStore = (props: { children?: React.ReactNode }) => Store({ reducers, context, ...props })
