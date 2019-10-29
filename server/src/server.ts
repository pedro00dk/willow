import * as cors from 'cors'
import * as express from 'express'
import * as log from 'npmlog'
import { Tracer } from './tracer'

/**
 * Server to expose tracers through http.
 */
export class Server {
    private server: express.Express

    constructor(
        private readonly port: number,
        private readonly tracers: { [language: string]: string },
        private readonly steps: number,
        private readonly timeout: number,
        clients: string
    ) {
        this.server = express()
        this.server = express()
        this.server.use(express.json())
        this.server.use(
            cors({
                origin: (origin, callback) =>
                    callback(clients === '*' || clients === origin ? undefined : new Error('illegal origin (CORS)')),
                credentials: true
            })
        )
        this.configureRoutes()
    }

    private configureRoutes() {
        this.server.get('/languages', (req, res) => {
            log.http(Server.name, req.path)
            res.send(Object.keys(this.tracers))
        })

        this.server.post('/trace', async (req, res) => {
            log.http(Server.name, req.path)
            const trace = {
                language: req.body['language'] as string,
                source: req.body['source'] as string,
                input: req.body['input'] as string
            }
            const steps = this.steps
            try {
                if (!this.tracers[trace.language]) throw new Error('unexpected language')
                const result = await new Tracer(this.tracers[trace.language]).run(trace, this.timeout)
                res.send(result)
                log.info(Server.name, req.path, 'ok')
            } catch (error) {
                res.status(400)
                res.send(error.message)
                log.info(Server.name, req.path, 'error', error.message)
            }
        })
    }

    listen() {
        log.info(Server.name, 'listen', { port: this.port })
        this.server.listen(this.port)
    }
}
