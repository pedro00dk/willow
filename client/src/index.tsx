import '@babel/polyfill' // regeneratorRuntime
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import React from 'react'
import ReactDom from 'react-dom'
import { App } from './components/App'

const webappConfigurationString = process.env['FIREBASE_WEBAPP_CONFIGURATION']
const firestoreEmulatorAddress = process.env['FIRESTORE_EMULATOR']

const webappConfiguration = JSON.parse(webappConfigurationString)
firebase.initializeApp(webappConfiguration)
if (firestoreEmulatorAddress !== 'false') firebase.firestore().settings({ host: firestoreEmulatorAddress, ssl: false })

ReactDom.render(<App />, document.getElementById('root'))
