import express from 'express'
import passport from 'passport'
import GoogleOAuth from 'passport-google-oauth20'
import { db } from '../database'
import { Config } from '../server'
import { User } from '../types/model'
import { appendActions } from './action'

export const router = (config: Config, callbackUrl: string) => {
    const strategy = new GoogleOAuth.Strategy(
        { clientID: config.auth.clientID, clientSecret: config.auth.clientSecret, callbackURL: callbackUrl },
        async (accessToken, refreshToken, profile, done) => {
            const profileUser = { id: profile.id, name: profile.displayName, email: profile.emails[0].value }
            await db?.users.updateOne(
                { id: profileUser.id },
                { $set: { ...profileUser }, $setOnInsert: { admin: false } },
                { upsert: true }
            )
            const user = await db?.users.findOne({ id: profileUser.id })
            done(undefined, user ?? profileUser)
        }
    )
    passport.serializeUser<User, string>(async (user, done) => done(undefined, db ? user.id : JSON.stringify(user)))
    passport.deserializeUser<User, string>(async (id, done) =>
        done(undefined, (await db?.users.findOne({ id })) ?? JSON.parse(id))
    )

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

    router.get('/callback', passport.authenticate('google'), async (req, res) => {
        const user = req.user as User
        console.log('http', req.originalUrl, req.cookies['referer'])
        await appendActions(user.id, [{ name: 'signin', date: new Date(), payload: undefined }])
        res.redirect(req.cookies['referer'])
    })

    router.get('/signout', async (req, res) => {
        const user = req.user as User
        console.log('http', req.originalUrl, req.user)
        await appendActions(user.id, [{ name: 'signout', date: new Date(), payload: undefined }])
        req.logOut()
        res.redirect(req.headers.referer ?? '/')
    })

    router.get('/user', (req, res) => {
        console.log('http', req.originalUrl, req.user)
        res.status(200).send(req.user)
    })

    return router
}
