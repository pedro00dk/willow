import express from 'express'
import { Action, User } from '../data'

/**
 * Create the handlers for reading action requests.
 */
export const router = (onAction: (user: User, action: Action) => void) => {
    const router = express.Router()
    router.post('/', async (req, res) => {
        console.log('http', req.originalUrl)
        const user = req.user as User
        const body = req.body
        const action = { name: body.name as string, date: new Date(body.date as string), payload: body.payload }
        onAction(user, action)
        res.status(204).send()
    })
    return router
}
