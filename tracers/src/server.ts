import * as express from 'express'
import * as log from 'npmlog'
import { StepConstraints } from './tracer/step-constraints'
import { Tracer } from './tracer/tracer'
import { TracerProcess } from './tracer/tracer-process'
import { TracerWrapper } from './tracer/tracer-wrapper'

/**
 * Server to expose tracers through http.
 */
export class Server {
    private server: express.Express
    private sessions: Map<number, { language: string; tracer: Tracer }> = new Map()
    private sessionIdGenerator: number = 0

    constructor(private mode: 'json' | 'proto', private port: number, private tracers: { [language: string]: string }) {
        this.server = express()
        this.server.use(express.json())
        this.configureServerRoutes()
    }

    private configureServerRoutes() {
        this.server.get('/tracers', (request, response) => {
            log.http(Server.name, request.path)
            response.send(Object.keys(this.tracers))
        })
        this.server.get('/sessions', (request, response) => {
            log.http(Server.name, request.path)
            response.send(
                [...this.sessions.entries()].map(([id, { language, tracer }]) => ({
                    id,
                    language,
                    state: tracer.getState()
                }))
            )
        })
        this.server.post('/create', (request, response) => {
            const language = request.body['language'] as string
            log.http(Server.name, request.path, { language })
            try {
                response.send(this.create(language))
            } catch (error) {
                response.status(400).send(error.message)
            }
        })
        this.server.post('/execute', async (request, response) => {
            const id = request.body['id'] as number
            const action = request.body['action'] as string
            const args = request.body['args'] as unknown[]
            log.http(Server.name, request.path, { id, action })
            try {
                const results = await this.execute(id, action, args)
                const finished = !this.sessions.has(id)
                response.setHeader('finished', finished.toString())
                response.send(results)
            } catch (error) {
                response.status(400).send(error.message)
            }
        })
    }

    create(language: string) {
        if (!this.tracers[language]) throw new Error('unexpected language')

        const id = this.sessionIdGenerator++
        log.info(Server.name, 'create', { id, language })
        const tracer = new TracerWrapper(new TracerProcess(this.tracers[language]))
        tracer.addStepProcessor(new StepConstraints(1000, 50, 50, 20, 100, 10))
        this.sessions.set(id, { language, tracer })
        return { id, language }
    }

    async execute(id: number, action: string, args: unknown[]) {
        if (!this.sessions.has(id)) throw new Error('session id not found')
        if (action == undefined) throw new Error('action not found')
        if (!args) throw new Error('args not found')

        log.info(Server.name, 'execute', { id, action })
        const tracer = this.sessions.get(id).tracer
        let result: unknown
        try {
            if (action === 'getState') result = tracer.getState()
            else if (action === 'start') result = await tracer.start(args[0] as string, args[1] as string)
            else if (action === 'stop') result = tracer.stop()
            else if (action === 'step') result = await tracer.step()
            else if (action === 'stepOver') result = await tracer.stepOver()
            else if (action === 'stepOut') result = await tracer.stepOut()
            else if (action === 'continue') result = await tracer.continue()
            else if (action === 'input') result = tracer.input(args[0] as string[])
            else if (action === 'getBreakpoints') result = tracer.getBreakpoints()
            else if (action === 'setBreakpoints') result = tracer.setBreakpoints(new Set(args[0] as number[]))
            else throw new Error('action not found')
        } catch (error) {
            throw error
        } finally {
            if (tracer.getState() === 'stopped') {
                log.info(Server.name, 'execute - tracer stopped', { id })
                this.sessions.delete(id)
            }
        }
        return result
    }

    listen() {
        log.info(Server.name, 'listen', { port: this.port })
        this.server.listen(this.port)
    }
}
