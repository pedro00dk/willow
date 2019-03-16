import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as log from 'npmlog'
import * as protocol from './protobuf/protocol'
import { StepConstraints } from './tracer/step-constraints'
import { Tracer } from './tracer/tracer'
import { TracerProcess } from './tracer/tracer-process'
import { TracerWrapper } from './tracer/tracer-wrapper'

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

class TracersService {
    private sessions: Map<number, { language: string; tracer: Tracer }> = new Map()
    private sessionIdGenerator: number = 0

    constructor(private tracers: { [language: string]: string }) {}

    private checkGetSessionTracer(id: number) {
        if (!this.sessions.has(id)) throw new Error('session id not found')
        return this.sessions.get(id).tracer
    }

    private removeTracerIfStopped(id: number) {
        if (!this.sessions.has(id) || this.sessions.get(id).tracer.getState() !== 'stopped') return
        log.info(Server.name, 'execute - tracer stopped', { id })
        this.sessions.delete(id)
    }

    getLanguages(request: protocol.Empty): protocol.Languages {
        return protocol.Languages.create({ languages: Object.keys(this.tracers) })
    }

    getSessions(request: protocol.Empty): protocol.Sessions {
        return protocol.Sessions.create({
            sessions: [...this.sessions.entries()].map(([id, { language }]) =>
                protocol.Session.create({ id: protocol.Id.create({ id }), language })
            )
        })
    }

    async start(request: protocol.StartRequest): Promise<protocol.StartResponse> {
        if (!this.tracers[request.language]) throw new Error('unexpected language')
        const id = this.sessionIdGenerator++
        log.info(Server.name, 'start', { id, language: request.language })
        const tracer = new TracerWrapper(new TracerProcess(this.tracers[request.language]))
        tracer.addStepProcessor(new StepConstraints(1000, 50, 50, 20, 100, 10))
        this.sessions.set(id, { language: request.language, tracer })
        const response = await tracer.start(request.start)
        this.removeTracerIfStopped(id)
        return protocol.StartResponse.create({ id: protocol.Id.create({ id }), response })
    }

    stop(request: protocol.Id): protocol.Empty {
        this.checkGetSessionTracer(request.id).stop()
        this.removeTracerIfStopped(request.id)
        return protocol.Empty.create()
    }

    async step(request: protocol.Id): Promise<protocol.TracerResponse> {
        const response = await this.checkGetSessionTracer(request.id).step()
        this.removeTracerIfStopped(request.id)
        return response
    }

    async stepOver(request: protocol.Id): Promise<protocol.TracerResponses> {
        const responses = await this.checkGetSessionTracer(request.id).stepOver()
        this.removeTracerIfStopped(request.id)
        return responses
    }

    async stepOut(request: protocol.Id): Promise<protocol.TracerResponses> {
        const responses = await this.checkGetSessionTracer(request.id).stepOut()
        this.removeTracerIfStopped(request.id)
        return responses
    }

    async continue(request: protocol.Id): Promise<protocol.TracerResponses> {
        const responses = await this.checkGetSessionTracer(request.id).continue()
        this.removeTracerIfStopped(request.id)
        return responses
    }

    input(request: protocol.InputRequest): protocol.Empty {
        this.checkGetSessionTracer(request.id.id).input(request.input)
        return protocol.Empty.create()
    }

    getBreakpoints(request: protocol.Id): protocol.Breakpoints {
        return this.checkGetSessionTracer(request.id).getBreakpoints()
    }

    setBreakpoints(request: protocol.BreakpointsRequest): protocol.Empty {
        return undefined
    }
}
