import express from 'express'
import { db } from '../db'
import { Action, RequestAction, User } from '../types/model'

export const router = () => {
    const router = express.Router()

    router.post<{}, unknown, RequestAction[]>('/', async (req, res) => {
        console.log('http', req.originalUrl)
        const user = req.user as User
        if (!user) return res.status(400).send()
        const actions = req.body.map(requestAction => ({ ...requestAction, date: new Date(requestAction.date) }))
        await appendActions(user.id, actions)
        res.send()
    })

    return router
}

export const appendActions = (id: string, actions: Action[]) =>
    db?.actions.updateOne({ id }, { $push: { actions: { $each: actions } } }, { upsert: true })
