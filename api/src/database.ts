import mongodb from 'mongodb'
import { Action, Actions, User } from './user'

/**
 * Mongo client and database.
 */
const mongo = {
    client: undefined as mongodb.MongoClient,
    db: undefined as mongodb.Db
}

/**
 * Connect to a mongo database and create the collections and indices.
 *
 * @param url connection url to mongo database
 * @param name the mongo database name
 */
export const connect = async (url: string, name: string) => {
    console.log('database', 'url', url, 'db', name)
    if (mongo.client?.isConnected()) return console.log('database', 'already connected')
    mongo.client = await mongodb.MongoClient.connect(url, { useUnifiedTopology: true })
    mongo.db = mongo.client.db(name)
    const usersCollection = mongo.db.collection<User>('users')
    const actionsCollection = mongo.db.collection<Actions>('actions')
    usersCollection.createIndex({ id: 1 }, { unique: true })
    actionsCollection.createIndex({ id: 1 }, { unique: true })
}

/**
 * Insert a new user and an empty action set for it into the database.
 *
 * @param user the user object
 * @returns the user from the database
 */
export const insertUser = async (user: User) => {
    const usersCollection = mongo.db.collection<User>('users')
    const actionsCollection = mongo.db.collection<Actions>('actions')
    await usersCollection.insertOne(user)
    await actionsCollection.insertOne({ id: user.id, actions: [] })
    return await findUser(user.id)
}

/**
 * Get the user from the database which has the same id.
 *
 * @param user the user id
 * @returns the user or undefined if not found
 */
export const findUser = async (id: string) => {
    const usersCollection = mongo.db.collection<User>('users')
    return await usersCollection.findOne({ id })
}

/**
 * Push a new action to the user actions.
 *
 * @param id the user id
 * @param action an action the user executed
 * @returns return if the action was pushed
 */
export const pushUserAction = async (id: string, action: Action) => {
    const actionsCollection = mongo.db.collection<Actions>('actions')
    const result = await actionsCollection.updateOne({ id }, { $push: { actions: action } })
    return result.modifiedCount !== 0
}
