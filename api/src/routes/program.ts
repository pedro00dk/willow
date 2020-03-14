import express from 'express'
import { db } from '../db'
import { Program, User } from '../types/model'

export const router = () => {
    const router = express.Router()

    router.get('/', async (req, res) => {
        console.log('http', req.originalUrl)
        const user = req.user as User
        if (!user) return res.status(401).send()
        const programs = (await db?.programs.findOne({ id: user.id })).programs ?? []
        res.send(programs)
    })

    router.post<{}, unknown, Program>('/insert', async (req, res) => {
        console.log('http', req.originalUrl)
        const user = req.user as User
        if (!user) return res.status(401).send()
        await db?.programs.updateOne({ id: user.id }, { $push: { programs: req.body } }, { upsert: true })
        res.send()
    })

    router.post<{}, unknown, number>('/delete', async (req, res) => {
        console.log('http', req.originalUrl)
        const user = req.user as User
        if (!user) return res.status(401).send()
        await db?.programs.updateOne({ id: user.id }, { $unset: { [`programs.${req.body}`]: '' } }, { upsert: true })
        await db?.programs.updateOne({ id: user.id }, { $pull: { programs: undefined } })
        res.send()
    })

    return router
}
