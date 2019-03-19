import * as React from 'react'
import * as Redux from 'redux'
import { default as thunk, ThunkAction, ThunkDispatch, ThunkMiddleware } from 'redux-thunk'
import { reducer as CodeReducer } from './code'
import { reducer as DebugReducer } from './debug'
import { reducer as IOReducer } from './io'
import { reducer as SessionReducer } from './session'

type State = {
    code: Parameters<typeof CodeReducer>[0]
    debug: Parameters<typeof DebugReducer>[0]
    io: Parameters<typeof IOReducer>[0]
    session: Parameters<typeof SessionReducer>[0]
}

type Action =
    | Parameters<typeof CodeReducer>[1]
    | Parameters<typeof DebugReducer>[1]
    | Parameters<typeof IOReducer>[1]
    | Parameters<typeof SessionReducer>[1]

type SubState = Pick<State, 'code'> | Pick<State, 'debug'> | Pick<State, 'io'> | Pick<State, 'session'>

export type ThunkAction<R = void> = ThunkAction<R, State, void, Action>

const reduxStoreEnhancer = Redux.compose(Redux.applyMiddleware(thunk as ThunkMiddleware<State, Action, void>))
const reduxStoreCreator = reduxStoreEnhancer(Redux.createStore)
const reduxStore = reduxStoreCreator(
    Redux.combineReducers<State, Action>({
        code: CodeReducer,
        debug: DebugReducer,
        io: IOReducer,
        session: SessionReducer
    })
)
const storeContext = React.createContext<typeof reduxStore>(undefined)

export function Store(props: { children?: React.ReactNode }) {
    return <storeContext.Provider value={reduxStore}>{props.children}</storeContext.Provider>
}

function equalStoreSubStates<T extends SubState, U extends SubState>(prev: T, next: U) {
    if (Object.is(prev, next)) return true
    const prevKeys = Object.keys(prev)
    const nextKeys = Object.keys(prev)
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
    React.useEffect(() => {
        let didUnsubscribe = false
        const checkSubStateUpdate = () => {
            const updatedSubState = memoSelector(store.getState())
            if (didUnsubscribe || equalStoreSubStates(updatedSubState, subState)) return
            setSubState(updatedSubState)
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
