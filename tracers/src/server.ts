import * as express from 'express'
import * as log from 'npmlog'
import { StepConstraints } from './tracer/step-constraints'
import { Tracer } from './tracer/tracer'
import { TracerWrapper } from './tracer/tracer-wrapper'


/**
 * Server to expose tracers through http.
 */
export class Server {
    private server: express.Express
    private port: number
    private suppliers: Map<string, (code: string) => Tracer>
    private sessions: Map<number, { supplier: string, tracer: Tracer }>
    private sessionIdGenerator: number

    /**
     * Creates the server with the port and the tracer suppliers.
     */
    constructor(port: number, suppliers: Map<string, (code: string) => Tracer>) {
        if (port < 0 || port > 65355) {
            const error = 'illegal port number'
            log.error(Server.name, error, { port })
            throw new Error(error)
        }
        this.server = express()
        this.server.use(express.json())
        this.port = port
        this.suppliers = suppliers
        this.sessions = new Map()
        this.sessionIdGenerator = 0
        this.configureRoutes()
    }

    /**
     * Configures server routes.
     */
    private configureRoutes() {
        this.server.get(
            '/suppliers',
            (request, response) => {
                log.http(Server.name, request.path)
                response.send(this.getSuppliers())
            }
        )
        this.server.get(
            '/sessions',
            (request, response) => {
                log.http(Server.name, request.path)
                response.send(this.getSessions())
            }
        )
        this.server.post(
            '/create',
            (request, response) => {
                const supplier = request.body['supplier'] as string
                const code = request.body['code'] as string
                log.http(Server.name, request.path, { supplier })
                try {
                    response.send(this.createSession(supplier, code))
                } catch (error) {
                    response.status(400).send(error.message)
                }
            }
        )
        this.server.post(
            '/execute',
            async (request, response) => {
                const id = request.body['id'] as number
                const action = request.body['action'] as string
                const args = request.body['args'] as unknown[]
                log.http(Server.name, request.path, { id, action })
                try {
                    const results = await this.executeOnSession(id, action, args)
                    const finished = !this.sessions.has(id)
                    response.setHeader('finished', finished.toString())
                    response.send(results)
                } catch (error) {
                    response.status(400).send(error.message)
                }
            }
        )
    }

    /**
     * Lists the available suppliers.
     */
    getSuppliers() {
        return [...this.suppliers.keys()]
    }

    /**
     * Returns the sessions ids and its suppliers.
     */
    getSessions() {
        return [...this.sessions.entries()]
            .map(([id, { supplier, tracer }]) => ({ id, supplier, state: tracer.getState() }))
    }

    /**
     * Creates a new tracer session with the received supplier and code.
     */
    createSession(supplier: string, code: string) {
        if (code == undefined) {
            const error = 'code not found'
            log.warn(Server.name, error, { code })
            throw new Error(error)
        }
        if (!this.suppliers.has(supplier)) {
            const error = `supplier not found`
            log.warn(Server.name, error, { supplier })
            throw new Error(error)
        }
        const id = this.sessionIdGenerator++
        let tracer = this.suppliers.get(supplier)(code)
        tracer = tracer instanceof TracerWrapper ? tracer : new TracerWrapper(tracer)
        tracer.addStepProcessor(new StepConstraints(1000, 50, 50, 20, 100, 10))
        this.sessions.set(id, { supplier, tracer })
        log.info(Server.name, 'created session', { id, supplier })
        return { id, supplier }
    }

    /**
     * Executes on the received session tracer an action correspondent to a tracer methods with the received args.
     */
    async executeOnSession(id: number, action: string, args: unknown[]) {
        if (id == undefined || !this.sessions.has(id)) {
            const error = 'session id not found'
            log.info(Server.name, error, { id })
            throw new Error(error)
        }
        if (action == undefined) {
            const error = 'action not found'
            log.info(Server.name, error, { action })
            throw new Error(error)
        }
        if (!args) {
            const error = 'args not found'
            log.info(Server.name, error, { args })
            throw new Error(error)
        }
        const tracer = this.sessions.get(id).tracer
        let result: unknown
        try {
            if (action === 'getState') result = tracer.getState()
            else if (action === 'start') result = await tracer.start()
            else if (action === 'stop') result = tracer.stop()
            else if (action === 'input') result = tracer.input(args[0] as string)
            else if (action === 'step') result = await tracer.step()
            else if (action === 'stepOver') result = await tracer.stepOver()
            else if (action === 'stepOut') result = await tracer.stepOut()
            else if (action === 'continue') result = await tracer.continue()
            else if (action === 'getBreakpoints') result = tracer.getBreakpoints()
            else if (action === 'setBreakpoints') result = tracer.setBreakpoints(args[0] as number[])
            else {
                const error = 'action not found'
                log.warn(Server.name, error, { action })
                throw new Error(error)
            }
        } catch (error) {
            throw error
        } finally {
            if (tracer.getState() === 'stopped') {
                log.info(Server.name, 'tracer stopped', { id })
                this.sessions.delete(id)
            }
        }
        log.info(Server.name, 'executed', { id, action })
        return result
    }

    /**
     * Starts the server.
     */
    listen() {
        log.info(Server.name, 'start listening', { port: this.port })
        this.server.listen(this.port)
    }
}
