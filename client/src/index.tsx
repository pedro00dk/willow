// required for parcel to generate target > ES5 builds
import '@babel/polyfill'

import * as React from 'react'
import * as ReactDom from 'react-dom'
import { App } from './App'
import { Store } from './reducers/Store'

ReactDom.render(
    <Store>
        <App />
    </Store>,
    document.getElementById('root')
)
