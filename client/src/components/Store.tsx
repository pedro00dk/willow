import * as React from 'react'

export type SubState = any
export type SubAction = { type?: string; payload?: any; error?: any }
export type SubReducer = (state: SubState, action: SubAction) => SubState
export type SubReducers = { [field: string]: SubReducer }

export type State<T extends SubReducers> = { [field in keyof T]: Parameters<T[field]>[0] }
export type Action<T extends SubReducers> = { [field in keyof T]: Parameters<T[field]>[1] }[keyof T] | {}
export type Reducer<T extends SubReducers> = (state: State<T>, action: Action<T>) => State<T>

export type AsyncAction<T extends SubReducers> = (dispatch: Dispatch<T>, getState: GetState<T>) => Promise<void>
export type GetState<T extends SubReducers> = () => State<T>
export type Dispatch<T extends SubReducers> = (action: Action<T> | AsyncAction<T>) => Promise<void>
export type Subscribe = (listener: () => void) => () => void
export type Store<T extends SubReducers> = { getState: GetState<T>; dispatch: Dispatch<T>; subscribe: Subscribe }
export type Hooks<T extends SubReducers> = {
    useDispatch: () => Dispatch<T>
    useSelection: <U>(query: (state: State<T>) => U) => U
}

// prettier-ignore
const combineReducers = <T extends SubReducers>(reducers: T): Reducer<T> =>
    (state: State<typeof reducers>, action: Action<typeof reducers>): State<typeof reducers> =>
        Object.fromEntries(
            Object.entries(reducers).map(([field, reducer]) => [field, reducer(field as keyof typeof state, action)])
        ) as State<typeof reducers>

const createStore = <T extends SubReducers>(reducer: Reducer<T>): Store<T> => {
    const state = { value: reducer({} as State<T>, {}) }
    const subscriptions = [] as (() => void)[]

    const getState = () => state.value

    const dispatch: Dispatch<T> = action => {
        if (typeof action === 'function') return action(dispatch, getState)
        state.value = reducer(state.value, action)
        subscriptions.forEach(listener => listener())
    }

    const subscribe = (listener: () => void) => {
        let isSubscribed = true
        subscriptions.push(listener)
        return () => {
            if (isSubscribed) subscriptions.splice(subscriptions.indexOf(listener), 1)
            isSubscribed = false
        }
    }

    return { getState, dispatch, subscribe }
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
            keysB.reduce((acc, key) => acc && selectionA[key] === selectionB[key], true)
        )
    }

    const useDispatch = () => store.dispatch

    const useSelection = <V extends any>(query: (state: State<T>) => V) => {
        const memoQuery = React.useCallback(query, [])
        const [selection, setSelection] = React.useState(() => memoQuery(store.getState()))
        const selectionRef = React.useRef(selection)

        React.useEffect(() => {
            const checkSelectionUpdate = () => {
                const updatedSelection = memoQuery(store.getState())
                const isPromise = typeof updatedSelection.then === 'function'
                const areEqual = areSelectionsEqual(selectionRef, updatedSelection)
                if (isPromise || areEqual) return
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
