import express from 'express'
import { Actions } from '../user'

/**
 * Create the handlers for reading action requests.
 *
 * @param onAppendAction called when a new action is received
 * @template T user type
 */
export const createHandlers = <T>(onAppendAction: (user: T, action: Actions['actions'][0]) => void) => {
    const router = express.Router()

    router.post('/append', async (req, res) => {
        const user = req.user as T
        const action = {
            date: new Date(req.body.date as string),
            name: req.body.name as string,
            payload: req.body.payload
        }
        console.log('http', req.path, user, action.date, action.name)
        onAppendAction(user, action)
        res.send()
    })

    return { handlers: [] as express.Handler[], router }
}
