import mongoose from 'mongoose'

const actionSchema = new mongoose.Schema({
    date: Date,
    name: String,
    payload: String
})

const userSchema = new mongoose.Schema(
    {
        id: { type: String },
        name: { type: String },
        email: { type: String },
        actions: [actionSchema]
    },
    { id: false }
)

export const User = mongoose.model('user', userSchema)

export const connectDatabase = (database: string) => mongoose.connect(database)

export const getUser = async (id: string, name?: string, email?: string) =>
    (await User.findOne({ id: id })) ?? (await new User({ id, name, email, actions: [] }).save())
