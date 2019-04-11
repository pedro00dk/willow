import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as log from 'npmlog'
import * as protocol from './protobuf/protocol'
import { Tracer } from './tracer'

/**
 * Skeleton implementation of the tracers service protocol.
 */
export class TracersSkeleton {
    private router_: express.Router

    get router() {
        return this.router_
    }

    constructor(private tracers: { [language: string]: string }, private readonly shell: string) {
        this.router_ = express.Router()
        this.router.use(bodyParser.json({ type: 'application/json' }))
        this.configureRoutes()
    }

    private async respond<T, U>(
        req: express.Request,
        res: express.Response,
        method: (request: T) => U | Promise<U>,
        requestType: { create: (properties: {}) => T; decode: (buffer: Buffer) => T },
        responseType: { encode: (response: U) => protobuf.Writer }
    ) {
        log.http(TracersSkeleton.name, 'respond', req.path)
        try {
            const result = method(requestType.create(req.body))
            res.send(result instanceof Promise ? await result : result)
        } catch (error) {
            ;(res.send as any)(400, error.message)
        }
    }

    private configureRoutes() {
        this.router.post('/languages', (req, res) =>
            this.respond(req, res, request => this.languages(request), protocol.Empty, protocol.Languages)
        )
        this.router.post('/trace', async (req, res) =>
            this.respond(req, res, request => this.trace(request), protocol.TraceRequest, protocol.Result)
        )
    }

    languages(request: protocol.Empty): protocol.Languages {
        return protocol.Languages.create({ languages: Object.keys(this.tracers) })
    }

    async trace(request: protocol.TraceRequest): Promise<protocol.Result> {
        if (!this.tracers[request.language]) throw new Error('unexpected language')
        return await new Tracer(this.tracers[request.language], this.shell, request.trace).run()
    }
}
