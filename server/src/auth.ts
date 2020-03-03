import cookieSession from 'cookie-session'
import express from 'express'
import passport from 'passport'
import GoogleOAuth from 'passport-google-oauth20'

/**
 * Create the handlers necessary to enable google oauth authentication and session management.
 *
 * @param credentials.clientID google oauth credential client id
 * @param credentials.clientSecret google oauth credential client secret
 * @param credentials.callbackURL one of the authorized redirect uris enabled in the google oauth credential
 *                                (it can be relative if server_address + router_path + callbackURL matches the one of
 *                                the redirect uris and the /success route provided by this router)
 * @param getUser transforms a profile into an user object
 * @param serializeUser transforms an user into its id
 * @param getUser transforms an id back to the user object
 * @param cookieKey key for session cookie encryption
 * @param redirectAddress redirects again from callbackURL to another URL (useful for going to origin '/' or CORS)
 * @template T user type
 */
export const createHandlers = <T>(
    credentials: { clientID: string; clientSecret: string; callbackURL: string },
    getUser: (profile: passport.Profile) => T,
    serializeUser: (user: T) => string,
    deserializeUser: (id: string) => T,
    cookieKey: string,
    redirectAddress: string
) => {
    const strategy = new GoogleOAuth.Strategy(credentials, (at, rt, profile, done) => done(undefined, getUser(profile)))
    passport.serializeUser<T, string>((user, done) => done(undefined, serializeUser(user)))
    passport.deserializeUser<T, string>((id, done) => done(undefined, deserializeUser(id)))

    passport.use(strategy)

    const handlers: express.Handler[] = [
        cookieSession({ keys: [cookieKey], maxAge: 24 * 60 * 60 * 1000 }),
        passport.initialize(),
        passport.session()
    ]

    const router = express.Router()

    router.get('/signin', passport.authenticate('google', { scope: ['profile', 'email'] }), (req, res) => {
        console.log('http', req.path)
    })

    router.get('/success', passport.authenticate('google'), (req, res) => {
        console.log('http', req.path, req.user, redirectAddress)
        res.redirect(redirectAddress)
    })

    router.get('/user', (req, res) => {
        console.log('http', req.path, req.user)
        res.send(req.user)
    })

    return { handlers, router }
}
