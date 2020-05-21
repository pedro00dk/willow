import '@babel/polyfill' // regeneratorRuntime
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import React from 'react'
import ReactDom from 'react-dom'
import { App } from './components/App'

const firebaseConfigEnv = process.env['FIREBASE_CONFIG']
const firebaseTestingEnv = process.env['FIREBASE_TESTING']

const firebaseConfig = JSON.parse(firebaseConfigEnv)
firebase.initializeApp(firebaseConfig)
if (firebaseTestingEnv !== 'false') firebase.firestore().settings({ host: firebaseTestingEnv, ssl: false })

ReactDom.render(<App />, document.getElementById('root'))
