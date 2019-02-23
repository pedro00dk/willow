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
type Action = Parameters<typeof CodeReducer>[1] |
    Parameters<typeof DebugReducer>[1] |
    Parameters<typeof IOReducer>[1] |
    Parameters<typeof SessionReducer>[1]
type SubState = Pick<State, 'code'> |
    Pick<State, 'debug'> |
    Pick<State, 'io'> |
    Pick<State, 'session'>
export type ThunkAction<R = void> = ThunkAction<R, State, void, Action>

const reduxStoreEnhancer = Redux.compose(Redux.applyMiddleware(thunk as ThunkMiddleware<State, Action, void>))
const reduxStoreCreator = reduxStoreEnhancer(Redux.createStore)
const reduxStore = reduxStoreCreator(Redux.combineReducers<State, Action>({
    code: CodeReducer,
    debug: DebugReducer,
    io: IOReducer,
    session: SessionReducer
}))
const storeContext = React.createContext<typeof reduxStore>(undefined)

export function Store(props: { children?}) {
    return <storeContext.Provider value={reduxStore}>
        {props.children}
    </storeContext.Provider>
}

function compareStoreSubStates<T extends SubState, U extends SubState>(prev: T, next: U) {
    if (Object.is(prev, next)) return true
    const prevKeys = Object.keys(prev)
    const nextKeys = Object.keys(prev)
    return prevKeys.length === nextKeys.length && nextKeys.reduce((acc, key) => acc && prev[key] === next[key], true)
}

export function useDispatch() {
    const store = React.useContext(storeContext)
    if (!store) throw new Error('Store context not found')
    return store.dispatch
}

export function useRedux<T extends SubState>(selector: (state: State) => T) {
    const store = React.useContext(storeContext)
    if (!store) throw new Error('Store context not found')

    const firstSelector = React.useCallback(selector, [])
    const storeReference = React.useRef(store)

    const [selection, setSelection] = React.useState(() => firstSelector(store.getState()))
    const previousSelection = React.useRef(selection)

    const checkAndSetSelection = () => {
        const newSubState = selector(store.getState())
        if (compareStoreSubStates(newSubState, previousSelection.current)) return
        setSelection(newSubState)
        previousSelection.current = newSubState
    }

    if (storeReference.current !== store) {
        storeReference.current = store
        checkAndSetSelection()
    }

    React.useEffect(
        () => {
            let didUnsubscribe = false
            const checkForUpdates = () => !didUnsubscribe ? checkAndSetSelection() : undefined
            checkForUpdates()
            const unsubscribe = store.subscribe(checkForUpdates)
            return () => {
                didUnsubscribe = true
                unsubscribe()
            }
        },
        [store, selector]
    )

    return selection
}
