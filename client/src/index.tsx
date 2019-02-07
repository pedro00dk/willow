import * as React from 'react'
import * as ReactDom from 'react-dom'
import { App } from './App'
import { Store } from './reducers/Store'


ReactDom.render(<Store><App /></Store>, document.getElementById('root'))
