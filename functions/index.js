const admin = require('firebase-admin')
const functions = require('firebase-functions')

admin.initializeApp({})
const firestore = admin.firestore()

const region = process.env['FUNCTION_REGION'] || 'us-east1'

/**
 * @param {Parameters<Parameters<functions.https.onRequest>[0]>[0]} request
 * @param {Parameters<Parameters<functions.https.onRequest>[0]>[1]} response
 * @param {string[]} methods
 */
const cors = (request, response, methods) => {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Methods', methods.join(','))
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    response.setHeader('Access-Control-Max-Age', '3600')
    response.setHeader('Content-Type', 'application/json')
    if (request.method === 'OPTIONS') {
        response.status(204).send()
        return false
    } else if (!methods.includes(request.method)) {
        response.status(405).send()
        return false
    }
    return true
}

exports.getLanguages = functions.region(region).https.onRequest(async (request, response) => {
    if (!cors(request, response, ['GET'])) return
    const tracers = (await firestore.collection('languages').get()).docs
        .map(document => document)
        .reduce((acc, next) => ((acc[next.id] = next.data()['tracer']), acc), {})
    response.status(200).json(tracers)
})

exports.setLanguages = functions.region(region).https.onRequest(async (request, response) => {
    if (!cors(request, response, ['POST'])) return
    if (request.get('Content-Type') != 'application/json') response.status(412).send()
    const batch = firestore.batch()
    const languages = firestore.collection('languages')
    const documents = await languages.listDocuments()
    documents.forEach(document => batch.delete(document))
    Object.entries(request.body).forEach(([language, tracer]) => batch.create(languages.doc(language), {tracer}))
    await batch.commit()
    response.status(200).send()
})

exports.createUser = functions
    .region(region)
    .auth.user()
    .onCreate(user => {
        firestore.collection('users').doc(user.uid).create({ name: user.displayName, email: user.email })
        firestore.collection('actions').doc(user.uid).create({ actions: [] })
    })
