import '@babel/polyfill' // regeneratorRuntime
import firebase from 'firebase'
import React from 'react'
import ReactDom from 'react-dom'
import { App } from './components/App'

const firebaseConfig = JSON.parse(process.env['FIREBASE_CONFIG'])
firebase.initializeApp(firebaseConfig)
firebase.firestore().collection('languages').get().then(x => console.log(x.docs.map(a => [a.id, a.data()])))

ReactDom.render(<App />, document.getElementById('root'))
