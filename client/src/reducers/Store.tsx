import * as React from 'react'
import * as ReactDom from 'react-dom'
import * as Redux from 'redux'
import { default as thunk, ThunkAction, ThunkMiddleware } from 'redux-thunk'
import { reducer as BreakpointsReducer } from './breakpoint'
import { reducer as CodeReducer } from './code'
import { reducer as DebugHeapReducer } from './debug/heap'
import { reducer as DebugIndexerReducer } from './debug/indexer'
import { reducer as DebugInterfaceReducer } from './debug/interface'
import { reducer as DebugResultReducer } from './debug/result'
import { reducer as DebugStackReducer } from './debug/stack'
import { reducer as InputReducer } from './input'
import { reducer as LanguageReducer } from './language'
import { reducer as SessionReducer } from './session'

const reducers = {
    breakpoint: BreakpointsReducer,
    code: CodeReducer,
    debugHeap: DebugHeapReducer,
    debugIndexer: DebugIndexerReducer,
    debugInterface: DebugInterfaceReducer,
    debugResult: DebugResultReducer,
    debugStack: DebugStackReducer,
    input: InputReducer,
    language: LanguageReducer,
    session: SessionReducer
}

export type State = { [property in keyof typeof reducers]: Parameters<typeof reducers[property]>[0] }

export type Action = {
    [property in keyof typeof reducers]: Parameters<typeof reducers[property]>[1]
}[keyof typeof reducers]

export type SubState = Partial<State>

export type AsyncAction<R = void> = ThunkAction<Promise<R>, State, void, Action>

const reduxStoreEnhancer = Redux.compose(Redux.applyMiddleware(thunk as ThunkMiddleware<State, Action, void>))
const reduxStoreCreator = reduxStoreEnhancer(Redux.createStore)
const reduxStore = reduxStoreCreator(Redux.combineReducers<State, Action>(reducers))
const storeContext = React.createContext<typeof reduxStore>(undefined)

export function Store(props: { children?: React.ReactNode }) {
    return <storeContext.Provider value={reduxStore}>{props.children}</storeContext.Provider>
}

function equalStoreSubStates<T extends SubState, U extends SubState>(prev: T, next: U) {
    if (Object.is(prev, next)) return true
    const prevKeys = Object.keys(prev)
    const nextKeys = Object.keys(next)

    return (
        prevKeys.length === nextKeys.length &&
        nextKeys.reduce(
            (acc, key) =>
                acc && (prev as { [key: string]: unknown })[key] === (next as { [key: string]: unknown })[key],
            true
        )
    )
}

export function useDispatch() {
    const store = React.useContext(storeContext)
    if (!store) throw new Error('store context not found')
    return store.dispatch
}

export function useRedux<T extends SubState>(selector: (state: State) => T) {
    const store = React.useContext(storeContext)
    if (!store) throw new Error('store context not found')
    const memoSelector = React.useCallback(selector, [])
    const [subState, setSubState] = React.useState(() => memoSelector(store.getState()))
    const subStateRef = React.useRef(subState)

    React.useEffect(() => {
        let didUnsubscribe = false

        const checkSubStateUpdate = () => {
            const updatedSubState = memoSelector(store.getState())
            if (didUnsubscribe || equalStoreSubStates(updatedSubState, subStateRef.current)) return
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
