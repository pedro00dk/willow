import cors from 'cors'
import express, { json } from 'express'
import log from 'npmlog'
import { Tracer } from './tracer'

/**
 * Server to expose tracers through http.
 */
export class Server {
    private server: express.Express

    constructor(
        private readonly tracers: { [language: string]: string },
        private readonly port: number,
        private readonly steps: number,
        private readonly timeout: number,
        private readonly debug: boolean,
        readonly clients: string
    ) {
        this.server = express()
        this.server.use(express.json())
        this.server.use(
            cors({
                origin: (origin, callback) => {
                    const allow = clients === '*' || clients === origin
                    callback(!allow && new Error('illegal origin (CORS)'), allow)
                },
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
            const language = req.body['language'] as string
            const trace = {
                source: req.body['source'] as string,
                input: req.body['input'] as string,
                steps: this.steps
            }
            try {
                if (!this.tracers[language]) throw new Error('unexpected language')
                const result = await new Tracer(this.tracers[language]).run(trace, this.timeout)
                res.send(result)
                log.info(Server.name, req.path, 'ok', this.debug && JSON.stringify({ trace, result }, undefined, 4))
            } catch (error) {
                res.status(400)
                res.send(error.message)
                log.info(Server.name, req.path, 'error', error.message, JSON.stringify({ trace }, undefined, 4))
            }
        })
    }

    listen() {
        log.info(Server.name, 'listen', { port: this.port })
        this.server.listen(this.port)
    }
}
