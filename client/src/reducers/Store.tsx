import * as React from 'react'
import { Provider } from 'react-redux'
import * as Redux from 'redux'
import { default as thunk, ThunkAction, ThunkDispatch, ThunkMiddleware } from 'redux-thunk'
import { reducer as CodeReducer } from './code'
import { reducer as DebugReducer } from './debug'
import { reducer as IOReducer } from './io'
import { reducer as SessionReducer } from './session'


const reduxStoreEnhancer = Redux.compose(Redux.applyMiddleware(thunk as ThunkMiddleware))
const reduxStoreCreator = reduxStoreEnhancer(Redux.createStore)
const reduxStore = reduxStoreCreator(Redux.combineReducers({
    code: CodeReducer,
    debug: DebugReducer,
    io: IOReducer,
    session: SessionReducer
}))

export type StoreState = ReturnType<typeof reduxStore.getState>
export type CodeStateProp = { code: StoreState['code'] }
export type DebugStateProp = { debug: StoreState['debug'] }
export type IOStateProp = { io: StoreState['io'] }
export type SessionStateProp = { session: StoreState['session'] }

// export thunk action and dispatch with resolved generics and its prop form
// they shall be used instead of redux Action, Dispatch and react-redux DispatchProp
export type StoreAction<R = void> = ThunkAction<R, StoreState, void, Redux.AnyAction>
export type StoreDispatchProp = { dispatch: ThunkDispatch<StoreState, void, Redux.AnyAction> }

// export renamed action and state types
export { Action as CodeAction } from './code'
export { Action as DebugAction } from './debug'
export { Action as IOAction } from './io'
export { Action as SessionAction } from './session'


export function Store(props: { children?: any }) {
    return <Provider store={reduxStore}>
        {props.children}
    </Provider>
}
