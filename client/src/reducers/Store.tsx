import * as React from 'react'
import { Provider } from 'react-redux'
import * as Redux from 'redux'
import { default as thunk, ThunkDispatch as ReduxThunkThunkDispatch, ThunkMiddleware } from 'redux-thunk'
import { reducer as CodeReducer } from './code'
import { reducer as IOReducer } from './io'


const reduxStoreEnhancer = Redux.compose(Redux.applyMiddleware(thunk as ThunkMiddleware))
const reduxStoreCreator = reduxStoreEnhancer(Redux.createStore)
const reduxStore = reduxStoreCreator(Redux.combineReducers({
    code: CodeReducer,
    io: IOReducer
}))

export type StoreState = ReturnType<typeof reduxStore.getState>

// export thunk dispatch with resolved generics and its prop form
// shall be used instead of redux Dispatch and DispatchProp when thunks are dispatched
export type ThunkDispatch = ReduxThunkThunkDispatch<StoreState, void, Redux.AnyAction>
export type ThunkDispatchProp = { dispatch: ThunkDispatch }

// export renamed action and state types
export { Action as CodeAction, State as CodeState } from './code'
export { Action as IOAction, State as IOState } from './io'


export function Store(props: { children?: any }) {
    return <Provider store={reduxStore}>
        {props.children}
    </Provider>
}
