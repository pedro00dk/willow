import cors from 'cors'
import express from 'express'
import { Profile } from 'passport'
import { connect, findUser, pushUserAction, insertUser } from './database'
import { handlers as createActionHandlers } from './routes/action'
import { createHandlers as createAuthenticationHandlers } from './routes/authentication'
import { createHandlers as createTracerHandlers } from './routes/tracer'
import { User, Actions, Action } from './user'

/**
 * Creates the server instance and all available handlers and routers, then return the server.
 *
 * @param tracers.commands languages and commands to spawn their tracers
 * @param tracers.steps maximum number of steps a tracer is allowed to run
 * @param tracers.timeout maximum time in milliseconds a tracer is allowed to run
 * @param signed.steps override tracers.steps for signed users
 * @param signed.timeout override tracers.timeout for signed users
 * @param authentication if set, enable google oauth routes for user signin
 * @param authentication.clientId google oauth client id
 * @param authentication.clientSecret google oauth client secret
 * @param database if set, enable user storage (requires authentication)
 * @param database.url connection url to mongo database
 * @param database.name the mongo database name
 * @param corsWhitelist allow cors clients suffixes ("," split) ("*" any)
 * @param verbose increase log output
 */
export const createServer = async (
    tracers: { commands: { [language: string]: string }; steps: number; timeout: number },
    signed: { steps: number; timeout: number },
    authentication: { clientId: string; clientSecret: string },
    database: { url: string; name: string },
    corsWhitelist: string[],
    verbose: boolean
) => {
    const server = express()
    server.use(express.json())
    if (corsWhitelist.length > 0)
        server.use(
            cors({
                origin: (origin, callback) => {
                    const allow =
                        origin == undefined ||
                        corsWhitelist.reduce((acc, suffix) => acc || suffix === '*' || origin.endsWith(suffix), false)
                    callback(!allow && new Error(`Illegal CORS origin ${origin}`), allow)
                },
                credentials: true
            })
        )

    const apiRouter = express.Router()
    server.use('/api', apiRouter)

    if (database) await connect(database.url, database.name)

    const getUserFromProfile = async (profile: Profile) => {
        const user = { id: profile.id, name: profile.displayName, email: profile.emails[0].value }
        return database ? (await findUser(user.id)) ?? (await insertUser(user)) : user
    }

    const serializeUser = async (user: User) => (database ? user.id : JSON.stringify(user))

    const deserializeUser = async (id: string) => (database ? await findUser(id) : JSON.parse(id))

    const onUserAction = (user: User, action: Action) => {
        if (!user || !action || !database) return
        console.log('action', user, action.name, action.date)
        return pushUserAction(user.id, action)
    }

    if (authentication) {
        const { handlers: authenticationHandlers, router: authenticationRouter } = createAuthenticationHandlers(
            authentication,
            '/api/authentication/callback',
            getUserFromProfile,
            serializeUser,
            deserializeUser,
            onUserAction
        )
        authenticationHandlers.forEach(handler => server.use(handler))
        apiRouter.use('/authentication', authenticationRouter)
    }

    const { handlers: actionHandlers, router: actionRouter } = createActionHandlers(onUserAction)
    actionHandlers.forEach(handler => server.use(handler))
    apiRouter.use('/action', actionRouter)

    const { handlers: tracerHandlers, router: tracerRouter } = createTracerHandlers(
        tracers,
        signed,
        onUserAction,
        verbose
    )
    tracerHandlers.forEach(handler => server.use(handler))
    apiRouter.use('/tracer', tracerRouter)
    return server
}
