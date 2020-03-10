import mongodb from 'mongodb'
import { User } from './user'

/**
 * Mongo client and database.
 */
const mongo = {
    client: undefined as mongodb.MongoClient,
    db: undefined as mongodb.Db
}

/**
 * Connect to a mongo database.
 * Check parameters documentation in server.ts.
 */
export const connectDatabaseClient = async (url: string, name: string) => {
    if (mongo.client?.isConnected()) {
        console.log('database', 'closing previous connection')
        await mongo.client.close()
    }
    console.log('database', `connecting to ${url}`, `db ${name}`)
    mongo.client = await mongodb.MongoClient.connect(url, { useUnifiedTopology: true })
    mongo.db = mongo.client.db(name)
}

/**
 * Get the user from the database which has the same id. If it does not exist, create a new one and return it.
 * @param user user object
 */
export const getUser = async (user: User | string, create = false) => {
    if (!mongo.client.isConnected()) throw Error('Mongo database is not connected')
    const usersCollection = mongo.db.collection<User>('users')
    let databaseUser = await usersCollection.findOne({ id: typeof user === 'object' ? user.id : user })
    if (!databaseUser && typeof user === 'object' && create) {
        await usersCollection.insertOne(user)
        databaseUser = await usersCollection.findOne({ id: user.id })
    }
    return databaseUser
}
