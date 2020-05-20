import '@babel/polyfill' // regeneratorRuntime
import firebase from 'firebase/app'
import 'firebase/firestore'
import React from 'react'
import ReactDom from 'react-dom'
import { App } from './components/App'

const firebaseConfigEnv = process.env['FIREBASE_CONFIG']
const firebaseConfig = JSON.parse(firebaseConfigEnv)
firebase.initializeApp(firebaseConfig)

ReactDom.render(<App />, document.getElementById('root'))
