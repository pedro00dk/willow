import * as axios from 'axios'
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
        private secret: string,
        clients: string,
        tracers: string,
        private lifetime: number,
        private inactive: number
    ) {
        this.server = express()
        this.server.use(express.json())
        this.server.use(session({ resave: false, saveUninitialized: true, secret }))
        this.server.use((request, response, next) => {
            // cors support with any origin (wildcard '*' not supported when credentials enabled)
            const origin = clients !== '*' ? clients : ([request.headers.origin].flat()[0] as string)
            response.header('Access-Control-Allow-Origin', origin)
            response.header('Access-Control-Allow-Credentials', 'true')
            response.header('Access-Control-Allow-Headers', 'Content-Type')
            next()
        })
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
                res.send(!!error.response ? error.response.data : error.toString())
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
                        this.stopClient(req.session.id)
                    }
                    const language = req.body['language'] as string
                    const main = req.body['main'] as string
                    const code = req.body['code'] as string
                    const startResponse = await this.tracersProxy.start(
                        protocol.StartRequest.create({ language, start: protocol.Action.Start.create({ main, code }) })
                    )
                    const response = startResponse.response
                    const lastEvent = response.events[response.events.length - 1]
                    if (!!lastEvent.started) this.startClient(req.session.id, startResponse.id.id)
                    return response
                },
                () => this.stopClient(req.session.id)
            )
        )
        tracersRouter.post('/stop', (req, res) =>
            asyncRespond(req, res, () => {
                const id = this.clientTracers.has(req.session.id) ? this.clientTracers.get(req.session.id).id : -1
                this.stopClient(req.session.id)
                return this.tracersProxy.stop(protocol.Id.create({ id }))
            })
        )
        tracersRouter.post('/step', (req, res) =>
            asyncRespond(
                req,
                res,
                async () => {
                    const id = this.clientTracers.has(req.session.id) ? this.clientTracers.get(req.session.id).id : -1
                    const response = await this.tracersProxy.step(protocol.Id.create({ id }))
                    const lastEvent = response.events[response.events.length - 1]
                    if (!!lastEvent.threw || (!!lastEvent.inspected && lastEvent.inspected.frame.finish))
                        this.stopClient(req.session.id)
                    return response
                },
                () => this.stopClient(req.session.id)
            )
        )
        tracersRouter.post('/stepOver', (req, res) =>
            asyncRespond(
                req,
                res,
                async () => {
                    const id = this.clientTracers.has(req.session.id) ? this.clientTracers.get(req.session.id).id : -1
                    const responses = await this.tracersProxy.stepOver(protocol.Id.create({ id }))
                    const lastResponse = responses.responses[responses.responses.length - 1]
                    const lastEvent = lastResponse.events[lastResponse.events.length - 1]
                    if (!!lastEvent.threw || (!!lastEvent.inspected && lastEvent.inspected.frame.finish))
                        this.stopClient(req.session.id)
                    return responses
                },
                () => this.stopClient(req.session.id)
            )
        )
        tracersRouter.post('/stepOut', (req, res) =>
            asyncRespond(
                req,
                res,
                async () => {
                    const id = this.clientTracers.has(req.session.id) ? this.clientTracers.get(req.session.id).id : -1
                    const responses = await this.tracersProxy.stepOut(protocol.Id.create({ id }))
                    const lastResponse = responses.responses[responses.responses.length - 1]
                    const lastEvent = lastResponse.events[lastResponse.events.length - 1]
                    if (!!lastEvent.threw || (!!lastEvent.inspected && lastEvent.inspected.frame.finish))
                        this.stopClient(req.session.id)
                    return responses
                },
                () => this.stopClient(req.session.id)
            )
        )
        tracersRouter.post('/continue', (req, res) =>
            asyncRespond(
                req,
                res,
                async () => {
                    const id = this.clientTracers.has(req.session.id) ? this.clientTracers.get(req.session.id).id : -1
                    const responses = await this.tracersProxy.continue(protocol.Id.create({ id }))
                    const lastResponse = responses.responses[responses.responses.length - 1]
                    const lastEvent = lastResponse.events[lastResponse.events.length - 1]
                    if (!!lastEvent.threw || (!!lastEvent.inspected && lastEvent.inspected.frame.finish))
                        this.stopClient(req.session.id)
                    return responses
                },
                () => this.stopClient(req.session.id)
            )
        )
        tracersRouter.post('/input', (req, res) =>
            asyncRespond(
                req,
                res,
                () => {
                    const id = this.clientTracers.has(req.session.id) ? this.clientTracers.get(req.session.id).id : -1
                    const lines = req.body as string[]
                    return this.tracersProxy.input(
                        protocol.InputRequest.create({
                            id: protocol.Id.create({ id }),
                            input: protocol.Action.Input.create({ lines })
                        })
                    )
                },
                () => this.stopClient(req.session.id)
            )
        )
        tracersRouter.post('/getBreakpoints', (req, res) =>
            asyncRespond(
                req,
                res,
                () => {
                    const id = this.clientTracers.has(req.session.id) ? this.clientTracers.get(req.session.id).id : -1
                    return this.tracersProxy.getBreakpoints(protocol.Id.create({ id }))
                },
                () => this.stopClient(req.session.id)
            )
        )
        tracersRouter.post('/setBreakpoints', (req, res) =>
            asyncRespond(
                req,
                res,
                () => {
                    const id = this.clientTracers.has(req.session.id) ? this.clientTracers.get(req.session.id).id : -1
                    const lines = req.body as number[]
                    return this.tracersProxy.setBreakpoints(
                        protocol.BreakpointsRequest.create({
                            id: protocol.Id.create({ id }),
                            breakpoints: protocol.Breakpoints.create({ lines })
                        })
                    )
                },
                () => this.stopClient(req.session.id)
            )
        )
        this.server.use('/tracers', tracersRouter)
    }

    startClient(client: string, tracer: number) {
        log.info(Server.name, 'start client', { client, tracer })
        if (this.clientTracers.has(client)) return
        this.clientTracers.set(client, {
            id: tracer,
            lifetime: setTimeout(() => this.stopClient(client), this.lifetime * 60000),
            inactive: setTimeout(() => this.stopClient(client), this.inactive * 60000)
        })
    }

    async stopClient(client: string) {
        log.info(Server.name, 'stop client', { client })
        if (!this.clientTracers.has(client)) return
        const clientData = this.clientTracers.get(client)
        clearTimeout(clientData.lifetime)
        clearTimeout(clientData.inactive)
        this.clientTracers.delete(client)
        try {
            await this.tracersProxy.stop(protocol.Id.create({ id: clientData.id }))
        } catch (error) {
            // ignore
            log.info(Server.name, 'stop client', 'raised', error.message)
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
