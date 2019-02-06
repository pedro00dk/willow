import * as React from 'react'
import { Provider } from 'react-redux'
import * as Redux from 'redux'
import thunk from 'redux-thunk'
import { reducer as CodeReducer } from './code'
import { reducer as IOReducer } from './io'

// export renamed action and state types
export { Action as CodeAction, State as CodeState } from './code'
export { Action as IOAction, State as IOState } from './io'


const reduxStoreEnhancer = Redux.compose(Redux.applyMiddleware(thunk))
const reduxStoreCreator = reduxStoreEnhancer(Redux.createStore)
const reduxStore = reduxStoreCreator(Redux.combineReducers({
    code: CodeReducer,
    io: IOReducer
}))

export type StoreState = ReturnType<typeof reduxStore.getState>

export function Store(props: { children?: any }) {
    return <Provider store={reduxStore}>
        {props.children}
    </Provider>
}
