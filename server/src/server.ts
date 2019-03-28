import * as axios from 'axios'
import * as cors from 'cors'
import * as express from 'express'
import * as session from 'express-session'
import * as log from 'npmlog'
import * as protocol from './protobuf/protocol'
import { TracersProxy } from './services/tracers-proxy'

/**
 * Http server to willow API.
 */
export class Server {
    private server: express.Express
    private tracersProxy: TracersProxy
    private clientTracers: Map<string, { id: number; lifetime: NodeJS.Timeout; inactive: NodeJS.Timeout }>

    constructor(
        private port: number,
        secret: string,
        clients: string,
        tracers: string,
        private lifetime: number,
        private inactive: number
    ) {
        this.server = express()
        this.server.use(express.json())
        this.server.use(session({ resave: false, saveUninitialized: true, secret }))

        this.server.use(
            cors({
                origin: (origin, callback) =>
                    clients === '*' || clients === origin
                        ? callback(undefined, true)
                        : callback(new Error('not allowed by CORS')),
                credentials: true
            })
        )

        this.tracersProxy = new TracersProxy(axios.default.create({ baseURL: tracers }))
        this.clientTracers = new Map()
        this.configureRoutes()
    }

    private configureRoutes() {
        this.server.get('/session', (req, res) => {
            log.http(Server.name, req.path)
            res.send({ session: req.session.id })
        })
        const tracersRouter = express.Router()

        const asyncRespond = async (
            req: express.Request,
            res: express.Response,
            action: () => Promise<unknown>,
            onError?: () => void
        ) => {
            log.http(Server.name, req.path)
            try {
                res.send(await action())
            } catch (error) {
                if (!!onError) onError()
                res.status(400)
                res.send(error.message)
            }
        }

        tracersRouter.get('/getLanguages', (req, res) =>
            asyncRespond(req, res, () => this.tracersProxy.getLanguages(protocol.Empty.create()))
        )
        // tracersRouter.get('/getSessions', (req, res) =>
        //     asyncRespond(req, res, () => this.tracersProxy.getSessions(protocol.Empty.create()))
        // )
        tracersRouter.post('/start', (req, res) =>
            asyncRespond(
                req,
                res,
                async () => {
                    if (this.clientTracers.has(req.session.id)) {
                        await this.tracersProxy.stop(
                            protocol.Id.create({ id: this.clientTracers.get(req.session.id).id })
                        )
                        this.clearClient(req.session.id)
                    }
                    const language = req.body['language'] as string
                    const main = req.body['main'] as string
                    const code = req.body['code'] as string
                    const startResponse = await this.tracersProxy.start(
                        protocol.StartRequest.create({ language, start: protocol.Action.Start.create({ main, code }) })
                    )
                    const response = startResponse.response
                    const lastEvent = response.events[response.events.length - 1]
                    if (!!lastEvent.started) this.createClient(req.session.id, startResponse.id.id)
                    return protocol.TracerResponse.toObject(response, { defaults: true, oneofs: true })
                },
                () => this.clearClient(req.session.id)
            )
        )
        tracersRouter.post('/stop', (req, res) =>
            asyncRespond(req, res, async () => {
                const id = this.clientTracers.has(req.session.id) ? this.clientTracers.get(req.session.id).id : -1
                this.clearClient(req.session.id)
                const empty = await this.tracersProxy.stop(protocol.Id.create({ id }))
                return protocol.Empty.toObject(empty, { defaults: true, oneofs: true })
            })
        )
        tracersRouter.post('/step', (req, res) =>
            asyncRespond(
                req,
                res,
                async () => {
                    const id = this.clientTracers.has(req.session.id) ? this.clientTracers.get(req.session.id).id : -1
                    const response = await this.tracersProxy.step(protocol.Id.create({ id }))
                    this.refreshClient(req.session.id)
                    const lastEvent = response.events[response.events.length - 1]
                    if (!!lastEvent.threw || (!!lastEvent.inspected && lastEvent.inspected.frame.finish))
                        this.clearClient(req.session.id)
                    return protocol.TracerResponse.toObject(response, { defaults: true, oneofs: true })
                },
                () => this.clearClient(req.session.id)
            )
        )
        tracersRouter.post('/stepOver', (req, res) =>
            asyncRespond(
                req,
                res,
                async () => {
                    const id = this.clientTracers.has(req.session.id) ? this.clientTracers.get(req.session.id).id : -1
                    const responses = await this.tracersProxy.stepOver(protocol.Id.create({ id }))
                    this.refreshClient(req.session.id)
                    const lastResponse = responses.responses[responses.responses.length - 1]
                    const lastEvent = lastResponse.events[lastResponse.events.length - 1]
                    if (!!lastEvent.threw || (!!lastEvent.inspected && lastEvent.inspected.frame.finish))
                        this.clearClient(req.session.id)
                    return protocol.TracerResponses.toObject(responses, { defaults: true, oneofs: true })
                },
                () => this.clearClient(req.session.id)
            )
        )
        tracersRouter.post('/stepOut', (req, res) =>
            asyncRespond(
                req,
                res,
                async () => {
                    const id = this.clientTracers.has(req.session.id) ? this.clientTracers.get(req.session.id).id : -1
                    const responses = await this.tracersProxy.stepOut(protocol.Id.create({ id }))
                    this.refreshClient(req.session.id)
                    const lastResponse = responses.responses[responses.responses.length - 1]
                    const lastEvent = lastResponse.events[lastResponse.events.length - 1]
                    if (!!lastEvent.threw || (!!lastEvent.inspected && lastEvent.inspected.frame.finish))
                        this.clearClient(req.session.id)
                    return protocol.TracerResponses.toObject(responses, { defaults: true, oneofs: true })
                },
                () => this.clearClient(req.session.id)
            )
        )
        tracersRouter.post('/continue', (req, res) =>
            asyncRespond(
                req,
                res,
                async () => {
                    const id = this.clientTracers.has(req.session.id) ? this.clientTracers.get(req.session.id).id : -1
                    const responses = await this.tracersProxy.continue(protocol.Id.create({ id }))
                    this.refreshClient(req.session.id)
                    const lastResponse = responses.responses[responses.responses.length - 1]
                    const lastEvent = lastResponse.events[lastResponse.events.length - 1]
                    if (!!lastEvent.threw || (!!lastEvent.inspected && lastEvent.inspected.frame.finish))
                        this.clearClient(req.session.id)
                    return protocol.TracerResponses.toObject(responses, { defaults: true, oneofs: true })
                },
                () => this.clearClient(req.session.id)
            )
        )
        tracersRouter.post('/input', (req, res) =>
            asyncRespond(
                req,
                res,
                async () => {
                    const id = this.clientTracers.has(req.session.id) ? this.clientTracers.get(req.session.id).id : -1
                    const lines = req.body as string[]
                    const empty = await this.tracersProxy.input(
                        protocol.InputRequest.create({
                            id: protocol.Id.create({ id }),
                            input: protocol.Action.Input.create({ lines })
                        })
                    )
                    this.refreshClient(req.session.id)
                    return protocol.Empty.toObject(empty, { defaults: true, oneofs: true })
                },
                () => this.clearClient(req.session.id)
            )
        )
        tracersRouter.post('/getBreakpoints', (req, res) =>
            asyncRespond(
                req,
                res,
                async () => {
                    const id = this.clientTracers.has(req.session.id) ? this.clientTracers.get(req.session.id).id : -1
                    const breakpoints = await this.tracersProxy.getBreakpoints(protocol.Id.create({ id }))
                    this.refreshClient(req.session.id)
                    return protocol.Breakpoints.toObject(breakpoints, { defaults: true, oneofs: true })
                },
                () => this.clearClient(req.session.id)
            )
        )
        tracersRouter.post('/setBreakpoints', (req, res) =>
            asyncRespond(
                req,
                res,
                async () => {
                    const id = this.clientTracers.has(req.session.id) ? this.clientTracers.get(req.session.id).id : -1
                    const lines = req.body as number[]
                    const empty = await this.tracersProxy.setBreakpoints(
                        protocol.BreakpointsRequest.create({
                            id: protocol.Id.create({ id }),
                            breakpoints: protocol.Breakpoints.create({ lines })
                        })
                    )
                    this.refreshClient(req.session.id)
                    return protocol.Empty.toObject(empty, { defaults: true, oneofs: true })
                },
                () => this.clearClient(req.session.id)
            )
        )
        this.server.use('/tracers', tracersRouter)
    }

    createClient(client: string, tracer: number) {
        log.info(Server.name, 'start client', { client, tracer })
        if (this.clientTracers.has(client)) return
        this.clientTracers.set(client, {
            id: tracer,
            lifetime: setTimeout(() => {
                log.info(Server.name, 'start client', 'lifetime timeout', { client, tracer })
                this.clearClient(client, true)
            }, this.lifetime * 60000),
            inactive: setTimeout(() => {
                log.info(Server.name, 'start client', 'inactive timeout', { client, tracer })
                this.clearClient(client, true)
            }, this.inactive * 60000)
        })
    }

    async clearClient(client: string, requireDelete: boolean = false) {
        log.info(Server.name, 'clear client', { client })
        if (!this.clientTracers.has(client)) return
        const clientData = this.clientTracers.get(client)
        clearTimeout(clientData.lifetime)
        clearTimeout(clientData.inactive)
        this.clientTracers.delete(client)
        if (!requireDelete) return
        log.info(Server.name, 'clear client', 'require delete', { client })
        try {
            await this.tracersProxy.stop(protocol.Id.create({ id: clientData.id }))
        } catch (error) {
            log.info(Server.name, 'clear client', 'require delete fail', { client, error: error.message })
        }
    }

    refreshClient(client: string) {
        log.info(Server.name, 'refresh client', { client })
        if (!this.clientTracers.has(client)) return
        const clientData = this.clientTracers.get(client)
        clientData.inactive.refresh()
    }

    async listen() {
        log.info(Server.name, 'listen', { port: this.port })
        await this.tracersProxy.connect()
        this.server.listen(this.port)
    }
}
