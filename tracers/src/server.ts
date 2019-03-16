import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as log from 'npmlog'
import * as protocol from './protobuf/protocol'
import { TracersService } from './tracers-service'

/**
 * Server to expose tracers through http.
 */
export class Server {
    private server: express.Express
    private service: TracersService

    constructor(private mode: 'json' | 'proto', private port: number, tracers: { [language: string]: string }) {
        this.server = express()
        this.server.use(
            this.mode === 'json'
                ? bodyParser.json({ type: 'application/json' })
                : bodyParser.raw({ type: 'application/octet-stream' })
        )
        this.service = new TracersService(tracers)
        this.configureServerRoutes()
    }

    private readRequestMessage<T>(req: express.Request, decode: (buf: Buffer) => T, create: (props: any) => T) {
        return this.mode === 'proto' ? decode(req.body as Buffer) : create(req.body)
    }

    private writeResponseMessage(res: express.Response, toProto: () => Uint8Array, toJson: () => {}) {
        res.send(this.mode === 'proto' ? toProto() : toJson())
    }

    private configureServerRoutes() {
        this.server.post('/getLanguages', (req, res) => {
            const request = this.readRequestMessage(req, protocol.Empty.decodeDelimited, protocol.Empty.create)
            const response = this.service.getLanguages(request)
            this.writeResponseMessage(res, () => protocol.Languages.encodeDelimited(response).finish(), () => response)
        })
        this.server.post('/getSessions', (req, res) => {
            const request = this.readRequestMessage(req, protocol.Empty.decodeDelimited, protocol.Empty.create)
            const response = this.service.getSessions(request)
            this.writeResponseMessage(res, () => protocol.Sessions.encodeDelimited(response).finish(), () => response)
        })
        this.server.post('/start', async (req, res) => {
            const request = this.readRequestMessage(
                req,
                protocol.StartRequest.decodeDelimited,
                protocol.StartRequest.create
            )
            const response = await this.service.start(request)
            this.writeResponseMessage(
                res,
                () => protocol.StartResponse.encodeDelimited(response).finish(),
                () => response
            )
        })
        this.server.post('/stop', (req, res) => {
            const request = this.readRequestMessage(req, protocol.Id.decodeDelimited, protocol.Id.create)
            const response = this.service.stop(request)
            this.writeResponseMessage(res, () => protocol.Empty.encodeDelimited(response).finish(), () => response)
        })
        this.server.post('/step', async (req, res) => {
            const request = this.readRequestMessage(req, protocol.Id.decodeDelimited, protocol.Id.create)
            const response = await this.service.step(request)
            this.writeResponseMessage(
                res,
                () => protocol.TracerResponse.encodeDelimited(response).finish(),
                () => response
            )
        })
        this.server.post('/stepOver', async (req, res) => {
            const request = this.readRequestMessage(req, protocol.Id.decodeDelimited, protocol.Id.create)
            const response = await this.service.stepOver(request)
            this.writeResponseMessage(
                res,
                () => protocol.TracerResponses.encodeDelimited(response).finish(),
                () => response
            )
        })
        this.server.post('/stepOut', async (req, res) => {
            const request = this.readRequestMessage(req, protocol.Id.decodeDelimited, protocol.Id.create)
            const response = await this.service.stepOut(request)
            this.writeResponseMessage(
                res,
                () => protocol.TracerResponses.encodeDelimited(response).finish(),
                () => response
            )
        })
        this.server.post('/continue', async (req, res) => {
            const request = this.readRequestMessage(req, protocol.Id.decodeDelimited, protocol.Id.create)
            const response = await this.service.continue(request)
            this.writeResponseMessage(
                res,
                () => protocol.TracerResponses.encodeDelimited(response).finish(),
                () => response
            )
        })
        this.server.post('/input', (req, res) => {
            const request = this.readRequestMessage(
                req,
                protocol.InputRequest.decodeDelimited,
                protocol.InputRequest.create
            )
            const response = this.service.input(request)
            this.writeResponseMessage(res, () => protocol.Empty.encodeDelimited(response).finish(), () => response)
        })
        this.server.post('/getBreakpoints', (req, res) => {
            const request = this.readRequestMessage(req, protocol.Id.decodeDelimited, protocol.Id.create)
            const response = this.service.getBreakpoints(request)
            this.writeResponseMessage(
                res,
                () => protocol.Breakpoints.encodeDelimited(response).finish(),
                () => response
            )
        })
        this.server.post('/setBreakpoints', (req, res) => {
            const request = this.readRequestMessage(
                req,
                protocol.BreakpointsRequest.decodeDelimited,
                protocol.BreakpointsRequest.create
            )
            const response = this.service.setBreakpoints(request)
            this.writeResponseMessage(res, () => protocol.Empty.encodeDelimited(response).finish(), () => response)
        })
    }

    listen() {
        log.info(Server.name, 'listen', { port: this.port })
        this.server.listen(this.port)
    }
}
