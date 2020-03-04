import cors from 'cors'
import express from 'express'
import { createHandlers as createAuthHandlers } from './routes/auth'
import { createHandlers as createTracerHandlers } from './routes/tracer'

/**
 * Creates the server instance and all available handlers and routers, then return the server listen function.
 *
 * @param tracers.commands dictionary with languages and commands to spawn their tracers
 * @param tracers.steps maximum number of steps a tracer is allowed to run
 * @param tracers.timeout maximum time in milliseconds a tracer is allowed to run
 * @param signed.steps override steps for signed users
 * @param signed.timeout override timeout for signed users
 * @param credentials.clientID google oauth credential client id
 * @param credentials.clientSecret google oauth credential client secret
 * @param credentials.callbackURL one of the authorized redirect uris enabled in the google oauth credential
 *                                (it can be relative if server_address + router_path + callbackURL matches the one of
 *                                the redirect uris and the /success route provided by this router)
 * @param cookieKey key for session cookie encryption
 * @param corsWhitelist set of client addresses to allow cors ('*' allow any address)
 * @param verbose enable verbose output (prints traces and results)
 */
export const createServer = (
    tracers: { commands: { [language: string]: string }; steps: number; timeout: number },
    signed: { steps: number; timeout: number },
    credentials: { clientID: string; clientSecret: string; callbackURL: string },
    cookieKey: string,
    corsWhitelist: Set<string>,
    verbose: boolean
) => {
    const server = express()
    server.use(express.json())
    if (corsWhitelist != undefined)
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

    if (credentials) {
        const { handlers: authHandlers, router: authRouter } = createAuthHandlers(
            credentials,
            cookieKey,
            profile => ({ id: profile.id, name: profile.displayName, email: profile.emails[0].value }),
            user => JSON.stringify(user),
            id => JSON.parse(id)
        )
        authHandlers.forEach(handler => server.use(handler))
        apiRouter.use('/auth', authRouter)
    }

    const { handlers: tracerHandlers, router: tracerRouter } = createTracerHandlers(tracers, signed, verbose)
    tracerHandlers.forEach(handler => server.use(handler))
    apiRouter.use('/tracer', tracerRouter)

    server.use('/api', apiRouter)

    return server
}
