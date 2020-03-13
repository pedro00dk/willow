import express from 'express'
import { db } from '../data/db'
import { Action, User } from '../data/model'

type RequestAction = Pick<Action, 'name' | 'payload'> & { date: string }

export const router = () => {
    const router = express.Router()

    router.post<{}, unknown, RequestAction>('/', async (req, res) => {
        console.log('http', req.originalUrl)
        const user = req.user as User
        if (!user) return res.status(400).send()
        const action = { ...req.body, date: new Date(req.body.date) }
        await appendAction(user.id, action)
        res.send()
    })

    return router
}

export const appendAction = (id: string, action: Action) =>
    db?.actions.updateOne({ id }, { $push: { actions: action } }, { upsert: true })
