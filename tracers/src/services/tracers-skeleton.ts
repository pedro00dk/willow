import * as bodyParser from 'body-parser'
import * as express from 'express'
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

    private readMessage<T>(req: express.Request, decode: (buf: Buffer) => T, create: (props: any) => T) {
        return this.mode === 'proto' ? decode(req.body as Buffer) : create(req.body as {})
    }

    private writeMessage(res: express.Response, toProto: () => Uint8Array, toJson: () => {}) {
        res.send(this.mode === 'proto' ? toProto() : toJson())
    }

    private configureRoutes() {
        this.router.get('/mode', (req, res) => res.send(this.mode))
        this.router.post('/getLanguages', (req, res) => {
            const response = this.getLanguages(
                this.readMessage(req, protocol.Empty.decodeDelimited, protocol.Empty.create)
            )
            this.writeMessage(res, () => protocol.Languages.encodeDelimited(response).finish(), () => response)
        })
        this.router.post('/getSessions', (req, res) => {
            const response = this.getSessions(
                this.readMessage(req, protocol.Empty.decodeDelimited, protocol.Empty.create)
            )
            this.writeMessage(res, () => protocol.Sessions.encodeDelimited(response).finish(), () => response)
        })
        this.router.post('/start', async (req, res) => {
            const response = await this.start(
                this.readMessage(req, protocol.StartRequest.decodeDelimited, protocol.StartRequest.create)
            )
            this.writeMessage(res, () => protocol.StartResponse.encodeDelimited(response).finish(), () => response)
        })
        this.router.post('/stop', (req, res) => {
            const response = this.stop(this.readMessage(req, protocol.Id.decodeDelimited, protocol.Id.create))
            this.writeMessage(res, () => protocol.Empty.encodeDelimited(response).finish(), () => response)
        })
        this.router.post('/step', async (req, res) => {
            const response = await this.step(this.readMessage(req, protocol.Id.decodeDelimited, protocol.Id.create))
            this.writeMessage(res, () => protocol.TracerResponse.encodeDelimited(response).finish(), () => response)
        })
        this.router.post('/stepOver', async (req, res) => {
            const response = await this.stepOver(this.readMessage(req, protocol.Id.decodeDelimited, protocol.Id.create))
            this.writeMessage(res, () => protocol.TracerResponses.encodeDelimited(response).finish(), () => response)
        })
        this.router.post('/stepOut', async (req, res) => {
            const response = await this.stepOut(this.readMessage(req, protocol.Id.decodeDelimited, protocol.Id.create))
            this.writeMessage(res, () => protocol.TracerResponses.encodeDelimited(response).finish(), () => response)
        })
        this.router.post('/continue', async (req, res) => {
            const response = await this.continue(this.readMessage(req, protocol.Id.decodeDelimited, protocol.Id.create))
            this.writeMessage(res, () => protocol.TracerResponses.encodeDelimited(response).finish(), () => response)
        })
        this.router.post('/input', (req, res) => {
            const response = this.input(
                this.readMessage(req, protocol.InputRequest.decodeDelimited, protocol.InputRequest.create)
            )
            this.writeMessage(res, () => protocol.Empty.encodeDelimited(response).finish(), () => response)
        })
        this.router.post('/getBreakpoints', (req, res) => {
            const response = this.getBreakpoints(this.readMessage(req, protocol.Id.decodeDelimited, protocol.Id.create))
            this.writeMessage(res, () => protocol.Breakpoints.encodeDelimited(response).finish(), () => response)
        })
        this.router.post('/setBreakpoints', (req, res) => {
            const response = this.setBreakpoints(
                this.readMessage(req, protocol.BreakpointsRequest.decodeDelimited, protocol.BreakpointsRequest.create)
            )
            this.writeMessage(res, () => protocol.Empty.encodeDelimited(response).finish(), () => response)
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
