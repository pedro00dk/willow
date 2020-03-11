import express from 'express'
import { Action, User } from '../user'

/**
 * Create the handlers for reading action requests.
 */
export const handlers = (onUserAction: (user: User, action: Action) => void) => {
    const router = express.Router()

    router.post('/append', async (req, res) => {
        const user = req.user as User
        const action = {
            name: req.body.name as string,
            date: new Date(req.body.date as string),
            payload: req.body.payload
        }
        console.log('http', req.path, user, action.date, action.name)
        onUserAction(user, action)
        res.send()
    })

    return { handlers: [] as express.Handler[], router }
}
