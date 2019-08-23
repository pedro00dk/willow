import * as React from 'react'
import * as Redux from 'redux'
import { default as thunk, ThunkAction, ThunkMiddleware } from 'redux-thunk'
import { reducer as ProgramReducer } from './program'
import { reducer as TracerReducer } from './tracer'

const reducers = {
    program: ProgramReducer,
    tracer: TracerReducer
}

export type State = { [property in keyof typeof reducers]: Parameters<typeof reducers[property]>[0] }

export type Action = {
    [property in keyof typeof reducers]: Parameters<typeof reducers[property]>[1]
}[keyof typeof reducers]

export type AsyncAction<R = void> = ThunkAction<Promise<R>, State, void, Action>

const reduxStoreEnhancer = Redux.compose(Redux.applyMiddleware(thunk as ThunkMiddleware<State, Action, void>))
const reduxStoreCreator = reduxStoreEnhancer(Redux.createStore)
const reduxStore = reduxStoreCreator(Redux.combineReducers<State, Action>(reducers))
const storeContext = React.createContext<typeof reduxStore>(undefined)

export const Store = (props: { children?: React.ReactNode }) => (
    <storeContext.Provider value={reduxStore}>{props.children}</storeContext.Provider>
)

const shallowCompareObjects = <T extends { [key: string]: unknown }>(prev: T, next: T) => {
    if (Object.is(prev, next)) return true
    const prevKeys = Object.keys(prev)
    const nextKeys = Object.keys(next)
    return prevKeys.length === nextKeys.length && nextKeys.reduce((acc, key) => acc && prev[key] === next[key], true)
}

const useStore = () => {
    const store = React.useContext(storeContext)
    if (!store) throw new Error('store context not found')
    return store
}

export const useGetState = () => {
    return useStore().getState
}

export const useDispatch = () => {
    return useStore().dispatch
}

export const useRedux = <T extends {} | void | Promise<void>>(selector: (state: State) => T) => {
    const store = useStore()
    const memoSelector = React.useCallback(selector, [])
    const [subState, setSubState] = React.useState(() => memoSelector(store.getState()))
    const subStateRef = React.useRef(subState)

    React.useEffect(() => {
        let didUnsubscribe = false

        const checkSubStateUpdate = () => {
            const updatedSubState = memoSelector(store.getState())
            if (
                didUnsubscribe ||
                subStateRef.current == undefined ||
                updatedSubState == undefined ||
                typeof (subStateRef.current as Promise<void>).then === 'function' ||
                typeof (updatedSubState as Promise<void>).then === 'function' ||
                shallowCompareObjects(updatedSubState as {}, subStateRef.current as {})
            )
                return
            setSubState(updatedSubState)
            subStateRef.current = updatedSubState
        }

        checkSubStateUpdate()
        const unsubscribe = store.subscribe(checkSubStateUpdate)
        return () => {
            didUnsubscribe = true
            unsubscribe()
        }
    }, [])

    return subState
}
