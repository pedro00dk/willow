import cors from 'cors'
import express from 'express'
import { Profile } from 'passport'
import { connectDatabaseClient, getUser } from './database'
import { createHandlers as createAuthenticationHandlers } from './routes/authentication'
import { createHandlers as createTracerHandlers } from './routes/tracer'
import { User } from './user'

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
 * @param database.uri connection uri to mongo database
 * @param database.name the mongo database name
 * @param corsWhitelist allow cors clients ('*' all clients)
 * @param verbose increase log output
 */
export const createServer = async (
    tracers: { commands: { [language: string]: string }; steps: number; timeout: number },
    signed: { steps: number; timeout: number },
    authentication: { clientId: string; clientSecret: string },
    database: { uri: string; name: string },
    corsWhitelist: Set<string>,
    verbose: boolean
) => {
    const server = express()
    server.use(express.json())
    // server.use((req, res, next) => {
    //     const origin = req.headers.origin as string
    //     if (corsWhitelist.size === 0 || origin == undefined) return next()
    //     const corsOrigin = corsWhitelist.has(origin) ? origin : corsWhitelist.has('*') ? '*' : ''
    //     res.setHeader('Control-Access-Allow-Origin', corsOrigin)
    //     res.setHeader('Control-Access-Allow-Credentials', 'true')
    //     if (req.method !== 'OPTIONS') return next()
    //     // preflight request
    // })
    if (corsWhitelist.size > 0)
        server.use(
            cors({
                origin: (origin, callback) => {
                    const allow = origin == undefined || corsWhitelist.has('*') || corsWhitelist.has(origin)
                    callback(!allow && new Error(`Illegal CORS origin address ${origin}`), allow)
                },
                credentials: true
            })
        )

    const apiRouter = express.Router()
    if (authentication) {
        if (database) await connectDatabaseClient(database.uri, database.name)

        const getUserFromProfile = async (profile: Profile) => {
            const user = { id: profile.id, name: profile.displayName, email: profile.emails[0].value }
            return database ? await getUser(user, true) : user
        }
        const serializeUser = async (user: User) => (database ? (await getUser(user)).id : JSON.stringify(user))
        const deserializeUser = async (id: string) => (database ? await getUser(id) : JSON.parse(id))

        const { handlers: authenticationHandlers, router: authenticationRouter } = createAuthenticationHandlers(
            authentication,
            '/api/authentication/callback',
            getUserFromProfile,
            serializeUser,
            deserializeUser
        )
        authenticationHandlers.forEach(handler => server.use(handler))
        apiRouter.use('/authentication', authenticationRouter)
    }
    const { handlers: tracerHandlers, router: tracerRouter } = createTracerHandlers(tracers, signed, verbose)
    tracerHandlers.forEach(handler => server.use(handler))
    apiRouter.use('/tracer', tracerRouter)
    server.use('/api', apiRouter)
    return server
}
