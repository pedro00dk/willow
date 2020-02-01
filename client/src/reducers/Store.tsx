import React from 'react'
import { reducer as inputReducer } from './input'
import { reducer as languageReducer } from './language'
import { reducer as sourceReducer } from './source'
import { reducer as tracerReducer } from './tracer'

export type SubState = any
export type SubAction = { type?: string; payload?: any; error?: any }
export type SubReducer = (state: SubState, action: SubAction) => SubState
export type SubReducers = { [name: string]: SubReducer }

export type State<T extends SubReducers> = { [name in keyof T]: Parameters<T[name]>[0] }
export type Action<T extends SubReducers> = { [name in keyof T]: Parameters<T[name]>[1] }[keyof T] | {}
export type Reducer<T extends SubReducers> = (state: State<T>, action: Action<T>) => State<T>

export type GetState<T extends SubReducers> = () => State<T>
export type Dispatch<T extends SubReducers> = (action: Action<T> | AsyncAction<T>, ignore?: boolean) => Promise<void>
export type AsyncAction<T extends SubReducers> = (dispatch: Dispatch<T>, getState: GetState<T>) => Promise<void>
export type Subscribe = (listener: () => void) => () => void
export type Store<T extends SubReducers> = {
    getState: GetState<T>
    getPreviousState: GetState<T>
    dispatch: Dispatch<T>
    subscribe: Subscribe
}

export type Hooks<T extends SubReducers> = {
    useDispatch: () => Dispatch<T>
    useSelection: <U>(query: (state: State<T>, previousState?: State<T>) => U) => U
}

const combineReducers = <T extends SubReducers>(reducers: T): Reducer<T> => (state, action) =>
    Object.fromEntries(Object.entries(reducers).map(([name, r]) => [name, r(state[name], action)])) as State<T>

const createStore = <T extends SubReducers>(reducer: Reducer<T>): Store<T> => {
    let state = {} as State<T>
    let previousState = state
    const subscriptions = [] as (() => void)[]

    const getState = () => state

    const getPreviousState = () => previousState

    const dispatch: Dispatch<T> = (action, ignore) => {
        if (typeof action === 'function') return action(dispatch, getState)
        previousState = state
        state = reducer(state, action)
        !ignore && subscriptions.forEach(listener => listener())
    }

    const subscribe = (listener: () => void) => {
        subscriptions.push(listener)
        return () => subscriptions.includes(listener) && subscriptions.splice(subscriptions.indexOf(listener), 1)
    }

    dispatch({})
    return { getState, getPreviousState, dispatch, subscribe }
}

const createHooks = <T extends SubReducers>(store: Store<T>): Hooks<T> => {
    const areSelectionsEqual = (selectionA: any, selectionB: any) => {
        if (Object.is(selectionA, selectionB)) return true
        if (typeof selectionA !== typeof selectionB) return false
        if (typeof selectionA !== 'object') return selectionA === selectionB
        const keysA = Object.keys(selectionA)
        const keysB = Object.keys(selectionB)
        return (
            keysA.length === keysB.length &&
            keysB.reduce((acc, next) => acc && selectionA[next] === selectionB[next], true)
        )
    }

    const useDispatch = () => store.dispatch

    const useSelection = <U extends any>(query: (state: State<T>, previousState?: State<T>) => U) => {
        const memoQuery = React.useCallback(query, [])
        const [selection, setSelection] = React.useState(() => memoQuery(store.getState(), store.getPreviousState()))
        const selectionRef = React.useRef(selection)

        React.useEffect(() => {
            const checkSelectionUpdate = () => {
                const updatedSelection = memoQuery(store.getState(), store.getPreviousState())
                const isPromise = typeof updatedSelection.then === 'function'
                const equals = !isPromise && areSelectionsEqual(selectionRef.current, updatedSelection)
                if (isPromise || equals) return
                setSelection((selectionRef.current = updatedSelection))
            }

            checkSelectionUpdate()
            const unsubscribe = store.subscribe(checkSelectionUpdate)

            return () => unsubscribe()
        }, [])

        return selection
    }

    return { useDispatch, useSelection }
}

export const Store = <T extends SubReducers>(props: {
    reducers: T
    context: React.Context<Hooks<T>>
    children?: React.ReactNode
}) => (
    <props.context.Provider value={createHooks(createStore(combineReducers(props.reducers)))}>
        {props.children}
    </props.context.Provider>
)

// default store

const reducers = {
    input: inputReducer,
    language: languageReducer,
    source: sourceReducer,
    tracer: tracerReducer
}

type Reducers = typeof reducers
export type DefaultState = State<Reducers>
export type DefaultAsyncAction = AsyncAction<Reducers>

const context = React.createContext<Hooks<Reducers>>(undefined)

export const useDispatch = () => React.useContext(context).useDispatch()
export const useSelection = <U extends any>(query: (state: State<Reducers>, previousState?: State<Reducers>) => U) =>
    React.useContext(context).useSelection(query)

export const DefaultStore = (props: { children?: React.ReactNode }) => Store({ reducers, context, ...props })
