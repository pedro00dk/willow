import * as React from 'react'
import * as Redux from 'redux'
import { default as thunk, ThunkAction, ThunkMiddleware } from 'redux-thunk'
import { reducer as BreakpointsReducer } from './breakpoints'
import { reducer as CodeReducer } from './code'
import { reducer as DebugReducer } from './debug'
import { reducer as LanguageReducer } from './language'
import { reducer as MarkersReducer } from './markers'
import { reducer as SessionReducer } from './session'

export type State = {
    breakpoints: Parameters<typeof BreakpointsReducer>[0]
    code: Parameters<typeof CodeReducer>[0]
    debug: Parameters<typeof DebugReducer>[0]
    language: Parameters<typeof LanguageReducer>[0]
    markers: Parameters<typeof MarkersReducer>[0]
    session: Parameters<typeof SessionReducer>[0]
}

export type Action =
    | Parameters<typeof BreakpointsReducer>[1]
    | Parameters<typeof CodeReducer>[1]
    | Parameters<typeof DebugReducer>[1]
    | Parameters<typeof LanguageReducer>[1]
    | Parameters<typeof MarkersReducer>[1]
    | Parameters<typeof SessionReducer>[1]

export type SubState = Partial<
    Pick<State, 'breakpoints'> &
        Pick<State, 'code'> &
        Pick<State, 'debug'> &
        Pick<State, 'language'> &
        Pick<State, 'markers'> &
        Pick<State, 'session'>
>

export type AsyncAction<R = void> = ThunkAction<Promise<R>, State, void, Action>

const reduxStoreEnhancer = Redux.compose(Redux.applyMiddleware(thunk as ThunkMiddleware<State, Action, void>))
const reduxStoreCreator = reduxStoreEnhancer(Redux.createStore)
const reduxStore = reduxStoreCreator(
    Redux.combineReducers<State, Action>({
        breakpoints: BreakpointsReducer,
        code: CodeReducer,
        debug: DebugReducer,
        language: LanguageReducer,
        markers: MarkersReducer,
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
