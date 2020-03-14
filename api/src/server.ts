import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import cors from 'cors'
import express from 'express'
import passport from 'passport'
import { connect } from './db'
import { router as actionRouter } from './routes/action'
import { router as authRouter } from './routes/auth'
import { router as exampleRouter } from './routes/example'
import { router as programRouter } from './routes/program'
import { router as tracerRouter } from './routes/tracer'

/**
 * Server configuration.
 */
export type Config = {
    tracers: { [language: string]: string }
    steps: number
    timeout: number
    authSteps: number
    authTimeout: number
    auth: { clientID: string; clientSecret: string }
    db: { url: string; name: string }
    cors: string[]
    port: number
    verbose: boolean
}

/**
 * Server to initialize express handlers and routes.
 */
export class Server {
    private server: express.Express

    constructor(private config: Config) {
        this.server = express()
        this.server.use(
            cors({
                origin: (origin, callback) => {
                    const allow = this.config.cors.reduce(
                        (acc, suffix) => acc || suffix === '*' || origin.endsWith(suffix),
                        origin == undefined
                    )
                    callback(!allow && new Error(`Illegal cors origin ${origin}`), allow)
                },
                credentials: true
            })
        )
        this.server.use(express.json())
        this.server.use(cookieParser())
        this.server.use(cookieSession({ signed: false, maxAge: 24 * 60 * 60 * 1000, sameSite: 'none', secure: false }))
        this.server.use(passport.initialize())
        this.server.use(passport.session())
    }

    async start() {
        if (this.config.db) await connect(this.config)
        const apiRouter = express.Router()
        if (this.config.auth) {
            apiRouter.use('/action', actionRouter())
            apiRouter.use('/auth', authRouter(this.config, '/api/auth/callback'))
            apiRouter.use('/program', programRouter())
        }
        apiRouter.use('/example', exampleRouter())
        apiRouter.use('/tracer', tracerRouter(this.config))
        this.server.use('/api', apiRouter)
        this.server.listen(this.config.port, () => console.log('server', 'listening at port', this.config.port))
    }
}
