import mongodb from 'mongodb'
import { Action, Actions, Example, Program, Programs, User } from './model'
import { Config } from '../server'

export const mongo = {
    connected: false,
    client: undefined as mongodb.MongoClient,
    db: undefined as mongodb.Db
}

export let db: {
    users: mongodb.Collection<User>
    actions: mongodb.Collection<Actions>
    programs: mongodb.Collection<Programs>
    examples: mongodb.Collection<Example>
}

export const connect = async (config: Config) => {
    if (!config.db) return
    console.log('database', 'url', config.db.url, 'db', config.db.name)
    mongo.client = await mongodb.MongoClient.connect(config.db.url, { useUnifiedTopology: true })
    mongo.connected = true
    console.log('database', 'connected')
    mongo.db = mongo.client.db(config.db.name)
    db = {
        users: mongo.db.collection('users'),
        actions: mongo.db.collection('actions'),
        programs: mongo.db.collection('programs'),
        examples: mongo.db.collection('examples')
    }
    db.users.createIndex({ id: 1 }, { unique: true })
    db.actions.createIndex({ id: 1 }, { unique: true })
    db.programs.createIndex({ id: 1 }, { unique: true })
}
