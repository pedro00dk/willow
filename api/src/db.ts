import mongodb from 'mongodb'
import { Action, Actions, Config, Example, Program, Programs, User } from './data'

const mongo = {
    client: undefined as mongodb.MongoClient,
    db: undefined as mongodb.Db
}

const db = {
    users: undefined as mongodb.Collection<User>,
    actions: undefined as mongodb.Collection<Actions>,
    programs: undefined as mongodb.Collection<Programs>,
    examples: undefined as mongodb.Collection<Example>
}

export const connect = async (config: Config) => {
    if (!config.db) return
    console.log('database', 'url', config.db.url, 'db', config.db.name)
    mongo.client = await mongodb.MongoClient.connect(config.db.url, { useUnifiedTopology: true })
    console.log('database', 'connected')
    mongo.db = mongo.client.db(config.db.name)
    db.users = mongo.db.collection('users')
    db.actions = mongo.db.collection('actions')
    db.programs = mongo.db.collection('programs')
    db.examples = mongo.db.collection('examples')
    db.users.createIndex({ id: 1 }, { unique: true })
    db.actions.createIndex({ id: 1 }, { unique: true })
    db.programs.createIndex({ id: 1 }, { unique: true })
}

export const insertUser = async (user: User) => {
    await db.users.insertOne(user)
    await db.actions.insertOne({ id: user.id, actions: [] })
    await db.programs.insertOne({ id: user.id, programs: [] })
    return await findUser(user.id)
}

export const findUser = (id: string) => db.users.findOne({ id })

export const findActions = async (id: string) => (await db.programs.findOne({ id })).programs

export const insertAction = (id: string, action: Action) => db.actions.updateOne({ id }, { $push: { actions: action } })

export const findPrograms = async (id: string) => (await db.programs.findOne({ id })).programs

export const insertProgram = (id: string, program: Program) =>
    db.programs.updateOne({ id }, { $push: { programs: program } })

export const deleteProgram = async (id: string, index: number) => {
    await db.programs.updateOne({ id }, { $unset: { [`programs.${index}`]: '' } })
    await db.programs.updateOne({ id }, { $pull: { programs: undefined } })
}

export const findExamples = () => db.examples.find().toArray()
