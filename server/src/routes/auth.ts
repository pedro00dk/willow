import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import express from 'express'
import passport from 'passport'
import GoogleOAuth from 'passport-google-oauth20'

/**
 * Create the handlers necessary to enable google oauth authentication and session management.
 * After signin, a redirect request is sent pointing to the address which the user accessed the signin.
 * Check parameters documentation in server.ts.
 *
 * @param getUser transforms a profile into an user object
 * @param serializeUser transforms an user into its id
 * @param getUser transforms an id back to the user object
 * @template T user type
 */
export const createHandlers = <T>(
    credentials: { clientID: string; clientSecret: string; callbackURL: string },
    cookieKey: string,
    getUser: (profile: passport.Profile) => T,
    serializeUser: (user: T) => string,
    deserializeUser: (id: string) => T
) => {
    const strategy = new GoogleOAuth.Strategy(credentials, (at, rt, profile, done) => done(undefined, getUser(profile)))
    passport.serializeUser<T, string>((user, done) => done(undefined, serializeUser(user)))
    passport.deserializeUser<T, string>((id, done) => done(undefined, deserializeUser(id)))

    passport.use(strategy)

    const handlers: express.Handler[] = [
        cookieParser(cookieKey, {}),
        // set cookieSession secure option to true when https enabled
        cookieSession({ secret: cookieKey, maxAge: 24 * 60 * 60 * 1000, sameSite: 'none', secure: false }),
        passport.initialize(),
        passport.session()
    ]

    const router = express.Router()

    router.get(
        '/signin',
        (req, res, next) => {
            console.log('http', req.originalUrl, req.headers.referer)
            // set address cookie before redirect to remember client origin in case of CORS access
            res.cookie('address', req.headers.referer, { sameSite: 'none' })
            next()
        },
        passport.authenticate('google', { scope: ['profile', 'email'] })
    )

    router.get('/success', passport.authenticate('google'), (req, res) => {
        console.log('http', req.originalUrl, req.cookies['address'])
        res.redirect(req.cookies['address'])
    })

    router.get('/signout', (req, res) => {
        console.log('http', req.originalUrl, req.user)
        req.logOut()
        res.redirect(req.headers.referer)
    })

    router.get('/user', (req, res) => {
        console.log('http', req.originalUrl, req.user)
        res.send(req.user)
    })

    return { handlers, router }
}
