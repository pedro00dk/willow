import express from 'express'
import passport from 'passport'
import GoogleOAuth from 'passport-google-oauth20'
import { Action, Config, User } from '../data'

/**
 * Create the handlers necessary to enable google oauth authentication and session management.
 * After signin, a redirect request is sent pointing to the url which the user accessed the signin.
 */
export const router = (
    config: Config,
    callbackUrl: string,
    getUserFromProfile: (profile: passport.Profile) => Promise<User>,
    serializeUser: (user: User) => Promise<string>,
    deserializeUser: (id: string) => Promise<User>,
    onAction: (User: User, action: Action) => void
) => {
    const strategy = new GoogleOAuth.Strategy(
        { clientID: config.auth.clientID, clientSecret: config.auth.clientSecret, callbackURL: callbackUrl },
        async (accessToken, refreshToken, profile, done) => done(undefined, await getUserFromProfile(profile))
    )
    passport.serializeUser<User, string>(async (user, done) => done(undefined, await serializeUser(user)))
    passport.deserializeUser<User, string>(async (id, done) => done(undefined, await deserializeUser(id)))
    passport.use('google', strategy)

    const router = express.Router()

    router.get(
        '/signin',
        (req, res, next) => {
            console.log('http', req.originalUrl, req.headers.referer)
            res.cookie('referer', req.headers.referer ?? '/', { sameSite: 'none' })
            next()
        },
        passport.authenticate('google', { scope: ['profile', 'email'] })
    )

    router.get('/callback', passport.authenticate('google'), (req, res) => {
        const user = req.user as User
        console.log('http', req.originalUrl, req.cookies['referer'])
        onAction(user, { date: new Date(), name: 'signin', payload: undefined })
        res.redirect(req.cookies['referer'])
    })

    router.get('/signout', (req, res) => {
        const user = req.user as User
        console.log('http', req.originalUrl, req.user)
        onAction(user, { date: new Date(), name: 'signout', payload: undefined })
        req.logOut()
        res.redirect(req.headers.referer ?? '/')
    })

    router.get('/user', (req, res) => {
        console.log('http', req.originalUrl, req.user)
        res.status(200).send(req.user)
    })

    return router
}
