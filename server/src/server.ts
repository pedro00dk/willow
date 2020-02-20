import cors from 'cors'
import express from 'express'
import { Tracer } from './tracer'

/**
 * Server to expose registered tracers through http.
 */
export class Server {
    private server: express.Express

    /**
     * Initializes the server setup its routes.
     *
     * @param tracers object with tracer languages as keys and init command as values
     * @param steps maximum number of steps tracers are allowed to execute
     * @param timeout maximum time for the tracer to finish its execution
     * @param clients specific client address for restricted CORS.
     * @param port port to server
     * @param verbose print trace and result objects
     */
    constructor(
        private readonly tracers: { [language: string]: string },
        private readonly steps: number,
        private readonly timeout: number,
        readonly clients: string,
        private readonly port: number,
        private readonly verbose: boolean
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

    /**
     * Set server routes.
     *
     * GET /languages
     * Returns a list of available tracer languages.
     *
     * POST/ trace
     * Receives a trace request, process it and returns the generated result.
     */
    private configureRoutes() {
        this.server.get('/languages', (req, res) => {
            console.log(Server.name, req.path)
            res.send(Object.keys(this.tracers))
        })

        this.server.post('/trace', async (req, res) => {
            console.log(Server.name, req.path)
            const language = req.body['language'] as string
            const trace = {
                source: req.body['source'] as string,
                input: req.body['input'] as string,
                steps: this.steps
            }
            console.log(Server.name, req.path, language, this.verbose && JSON.stringify(trace))
            try {
                if (!this.tracers[language]) throw new Error('unexpected language')
                const result = await new Tracer(this.tracers[language]).run(trace, this.timeout)
                res.send(result)
                console.log(Server.name, req.path, 'ok', this.verbose && JSON.stringify(result, undefined, 4))
            } catch (error) {
                res.status(400)
                res.send(error.message)
                console.log(Server.name, req.path, 'error', error.message)
            }
        })
    }

    /**
     * Start the server.
     */
    listen() {
        console.log(Server.name, 'listen', this.port)
        this.server.listen(this.port)
    }
}
