import * as React from 'react'
import { Provider } from 'react-redux'
import * as Redux from 'redux'
import thunk from 'redux-thunk'
import { reducer as CodeReducer } from './code'

// export renamed action and state types
export { DispatchProp } from 'react-redux'
export { Action as CodeAction, State as CodeState } from './code'


const reduxStoreEnhancer = Redux.compose(Redux.applyMiddleware(thunk))
const reduxStoreCreator = reduxStoreEnhancer(Redux.createStore)
const reduxStore = reduxStoreCreator(Redux.combineReducers({
    code: CodeReducer
}))

export type StoreState = ReturnType<typeof reduxStore.getState>

export function Store(props: { children?: any }) {
    return <Provider store={reduxStore}>
        {props.children}
    </Provider>
}
