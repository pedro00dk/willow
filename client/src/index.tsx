import '@babel/polyfill' // regeneratorRuntime
import firebase from 'firebase'
import React from 'react'
import ReactDom from 'react-dom'
import { App } from './components/App'

const firebaseConfig = JSON.parse(process.env['FIREBASE_CONFIG'])
firebase.initializeApp(firebaseConfig)

ReactDom.render(<App />, document.getElementById('root'))
