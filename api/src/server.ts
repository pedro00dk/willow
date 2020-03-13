import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import cors from 'cors'
import express from 'express'
import passport from 'passport'
import { Action, Config, User } from './data'
import * as db from './db'
import { router as actionRouter } from './routes/action'
import { router as authRouter } from './routes/auth'
import { router as tracerRouter } from './routes/tracer'

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

    private async getUserFromProfile(profile: passport.Profile) {
        const profileUser = { id: profile.id, name: profile.displayName, email: profile.emails[0].value, admin: false }
        try {
            return this.config.db
                ? (await db.findUser(profileUser.id)) ?? (await db.insertUser(profileUser))
                : profileUser
        } catch (error) {
            console.log(error)
            return undefined
        }
    }

    private async serializeUser(user: User) {
        return this.config.db ? user.id : JSON.stringify(user)
    }

    private async deserializeUser(id: string) {
        try {
            return this.config.db ? await db.findUser(id) : (JSON.parse(id) as User)
        } catch (error) {
            console.log(error)
            return undefined
        }
    }

    private async insertAction(user: User, action: Action) {
        if (!user || !action || !this.config.db) return
        console.log('action', user, action.name, action.date)
        try {
            db.insertAction(user.id, action)
        } catch (error) {
            console.log(error)
        }
    }

    private connectDb() {
        return db.connect(this.config)
    }

    private createRoutes() {
        const apiRouter = express.Router()
        apiRouter.use('/action', actionRouter(this.insertAction))
        apiRouter.use(
            '/auth',
            authRouter(
                this.config,
                '/api/auth/callback',
                this.getUserFromProfile,
                this.serializeUser,
                this.deserializeUser,
                this.insertAction
            )
        )
        apiRouter.use('/tracer', tracerRouter(this.config, this.insertAction))
        this.server.use('/api', apiRouter)
    }

    async start() {
        await this.connectDb()
        this.createRoutes()
        this.server.listen(this.config.port, () => console.log('server', 'started at port', this.config.port))
    }
}
