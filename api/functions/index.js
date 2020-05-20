const admin = require('firebase-admin')
const functions = require('firebase-functions')

admin.initializeApp({})
const firestore = admin.firestore()

const region = process.env['REGION'] || 'us-east1'

const cors = response => {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Methods', 'POST')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    response.setHeader('Access-Control-Max-Age', '3600')
    response.setHeader('Content-Type', 'application/json')
}

exports.listTracers = functions.region(region).https.onRequest(async (request, response) => {
    cors(response)
    const tracers = (await firestore.collection('tracers').get()).docs
        .map(document => document)
        .reduce((acc, next) => ((acc[next.id] = next.data()['url']), acc), {})
    response.status(200).json(tracers)
})
