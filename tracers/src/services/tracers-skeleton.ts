import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as log from 'npmlog'
import * as protocol from '../protobuf/protocol'
import { StepConstraints } from '../tracer/step-constraints'
import { Tracer } from '../tracer/tracer'
import { TracerProcess } from '../tracer/tracer-process'
import { TracerWrapper } from '../tracer/tracer-wrapper'

/**
 * Skeleton implementation of the tracers service protocol.
 */
export class TracersSkeleton {
    private router_: express.Router
    private sessions: Map<number, { language: string; tracer: Tracer }> = new Map()
    private sessionIdGenerator: number = 0

    get router() {
        return this.router_
    }

    constructor(private mode: 'json' | 'proto', private tracers: { [language: string]: string }) {
        this.router_ = express.Router()
        this.router.use(
            this.mode === 'json'
                ? bodyParser.json({ type: 'application/json' })
                : bodyParser.raw({ type: 'application/octet-stream' })
        )
        this.configureRoutes()
    }

    private async respond<T, U>(
        req: express.Request,
        res: express.Response,
        method: (request: T) => U | Promise<U>,
        decode: (buffer: Buffer) => T,
        create: (properties: {}) => T,
        toProto: (response: U) => Uint8Array,
        toJson: (response: U) => {}
    ) {
        try {
            const request = this.mode === 'proto' ? decode(req.body) : create(req.body)
            const response = method(request)
            const awaitedResponse = response instanceof Promise ? await response : response
            res.send(this.mode === 'proto' ? toProto(awaitedResponse) : toJson(awaitedResponse))
        } catch (error) {
            res.status(400)
            res.send(error.message)
        }
    }

    private configureRoutes() {
        this.router.get('/mode', (req, res) => {
            log.http(TracersSkeleton.name, 'mode', { mode: this.mode })
            res.send(this.mode)
        })
        this.router.post('/getLanguages', (req, res) => {
            log.http(TracersSkeleton.name, 'getLanguages')
            this.respond<protocol.Empty, protocol.Languages>(
                req,
                res,
                request => this.getLanguages(request),
                buffer => protocol.Empty.decodeDelimited(buffer),
                properties => protocol.Empty.create(properties),
                response => protocol.Languages.encodeDelimited(response).finish(),
                response => response
            )
        })
        this.router.post('/getSessions', (req, res) => {
            log.http(TracersSkeleton.name, 'getSessions')
            this.respond<protocol.Empty, protocol.Sessions>(
                req,
                res,
                request => this.getSessions(request),
                buffer => protocol.Empty.decodeDelimited(buffer),
                properties => protocol.Empty.create(properties),
                response => protocol.Sessions.encodeDelimited(response).finish(),
                response => response
            )
        })
        this.router.post('/start', async (req, res) => {
            log.http(TracersSkeleton.name, 'start')
            this.respond<protocol.StartRequest, protocol.StartResponse>(
                req,
                res,
                request => this.start(request),
                buffer => protocol.StartRequest.decodeDelimited(buffer),
                properties => protocol.StartRequest.create(properties),
                response => protocol.StartResponse.encodeDelimited(response).finish(),
                response => response
            )
        })
        this.router.post('/stop', (req, res) => {
            this.respond<protocol.Id, protocol.Empty>(
                req,
                res,
                request => this.stop(request),
                buffer => protocol.Id.decodeDelimited(buffer),
                properties => protocol.Id.create(properties),
                response => protocol.Empty.encodeDelimited(response).finish(),
                response => response
            )
        })
        this.router.post('/step', async (req, res) => {
            this.respond<protocol.Id, protocol.TracerResponse>(
                req,
                res,
                request => this.step(request),
                buffer => protocol.Id.decodeDelimited(buffer),
                properties => protocol.Id.create(properties),
                response => protocol.TracerResponse.encodeDelimited(response).finish(),
                response => response
            )
        })
        this.router.post('/stepOver', async (req, res) => {
            log.http(TracersSkeleton.name, 'stepOver')
            this.respond<protocol.Id, protocol.TracerResponses>(
                req,
                res,
                request => this.stepOver(request),
                buffer => protocol.Id.decodeDelimited(buffer),
                properties => protocol.Id.create(properties),
                response => protocol.TracerResponses.encodeDelimited(response).finish(),
                response => response
            )
        })
        this.router.post('/stepOut', async (req, res) => {
            log.http(TracersSkeleton.name, 'stepOut')
            this.respond<protocol.Id, protocol.TracerResponses>(
                req,
                res,
                request => this.stepOut(request),
                buffer => protocol.Id.decodeDelimited(buffer),
                properties => protocol.Id.create(properties),
                response => protocol.TracerResponses.encodeDelimited(response).finish(),
                response => response
            )
        })
        this.router.post('/continue', async (req, res) => {
            this.respond<protocol.Id, protocol.TracerResponses>(
                req,
                res,
                request => this.continue(request),
                buffer => protocol.Id.decodeDelimited(buffer),
                properties => protocol.Id.create(properties),
                response => protocol.TracerResponses.encodeDelimited(response).finish(),
                response => response
            )
        })
        this.router.post('/input', (req, res) => {
            log.http(TracersSkeleton.name, 'input')
            this.respond<protocol.InputRequest, protocol.Empty>(
                req,
                res,
                request => this.input(request),
                buffer => protocol.InputRequest.decodeDelimited(buffer),
                properties => protocol.InputRequest.create(properties),
                response => protocol.Empty.encodeDelimited(response).finish(),
                response => response
            )
        })
        this.router.post('/getBreakpoints', (req, res) => {
            log.http(TracersSkeleton.name, 'getBreakpoints')
            this.respond<protocol.Id, protocol.Breakpoints>(
                req,
                res,
                request => this.getBreakpoints(request),
                buffer => protocol.Id.decodeDelimited(buffer),
                properties => protocol.Id.create(properties),
                response => protocol.Breakpoints.encodeDelimited(response).finish(),
                response => response
            )
        })
        this.router.post('/setBreakpoints', (req, res) => {
            log.http(TracersSkeleton.name, 'setBreakpoints')
            this.respond<protocol.BreakpointsRequest, protocol.Empty>(
                req,
                res,
                request => this.setBreakpoints(request),
                buffer => protocol.BreakpointsRequest.decodeDelimited(buffer),
                properties => protocol.BreakpointsRequest.create(properties),
                response => protocol.Empty.encodeDelimited(response).finish(),
                response => response
            )
        })
    }

    private checkGetSessionTracer(id: number) {
        if (!this.sessions.has(id)) throw new Error('session id not found')
        return this.sessions.get(id).tracer
    }

    private removeTracerIfStopped(id: number) {
        if (!this.sessions.has(id) || this.sessions.get(id).tracer.getState() !== 'stopped') return
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
