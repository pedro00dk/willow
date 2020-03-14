import express from 'express'
import { db } from '../db'
import { Example, User } from '../types/model'

export const router = () => {
    const router = express.Router()

    router.get('/', async (req, res) => {
        console.log('http', req.originalUrl)
        const examples = (await db?.examples.find().toArray()) ?? []
        res.send(examples)
    })

    router.post<{}, unknown, Example>('/insert', async (req, res) => {
        console.log('http', req.originalUrl)
        const user = req.user as User
        if (!user || !user.admin) return res.status(401).send()
        await db?.examples.insertOne(req.body)
        res.send()
    })

    return router
}
