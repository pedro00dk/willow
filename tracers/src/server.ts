import * as express from 'express'

import { Tracer, TracerWrapper } from './tracer/tracer'


/**
 * Server to expose tracers through http.
 */
export class TracerServer {
    private server: express.Express
    private port: number
    private suppliers: Map<string, (code: string) => Tracer>
    private sessions: Map<number, { supplier: string, tracer: Tracer }>
    private sessionIdGenerator: number

    /**
     * Creates the server with the port and the tracer suppliers.
     */
    constructor(port: number, suppliers: Map<string, (code: string) => Tracer>) {
        if (port < 0 || port > 65355) throw new Error('Illegal port number')

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
        this.server.get('/suppliers', (request, response) => response.send(this.getSuppliers()))
        this.server.get('/sessions', (request, response) => response.send(this.getSessions()))
        this.server.post(
            '/create',
            (request, response) => {
                const supplier = request.body['supplier'] as string
                const code = request.body['code'] as string
                try { response.send(this.createSession(supplier, code)) }
                catch (error) { response.status(400).send(error.message) }
            }
        )
        this.server.post(
            '/execute',
            async (request, response) => {
                const id = request.body['id'] as number
                const action = request.body['action'] as string
                const args = request.body['args'] as any[]
                try { response.send(await this.executeOnSession(id, action, args)) }
                catch (error) { response.status(400).send(error.message) }
            }
        )
    }

    /**
     * Lists the available suppliers.
     */
    private getSuppliers() {
        return [...this.suppliers.keys()]
    }

    /**
     * Returns the sessions ids and its suppliers.
     */
    private getSessions() {
        return [...this.sessions.entries()]
            .map(([id, { supplier, tracer }]) => ({ id, supplier, state: tracer.getState() }))
    }

    /**
     * Creates a new tracer session with the received supplier and code.
     */
    private createSession(supplier: string, code: string) {
        if (supplier == null) throw new Error('supplier not found or wrong type')
        if (code == null) throw new Error('code not found or wrong type')
        if (!this.suppliers.has(supplier)) throw new Error(`supplier ${supplier} not found`)

        const id = this.sessionIdGenerator++
        let tracer = this.suppliers.get(supplier)(code)
        tracer = tracer instanceof TracerWrapper ? tracer : new TracerWrapper(tracer)

        this.sessions.set(id, { supplier, tracer })
        return { id, supplier }
    }

    /**
     * Executes on the received session tracer an action correspondent to a tracer methods with the received args.
     */
    private async executeOnSession(id: number, action: string, args: any[]) {
        if (id == null || !this.sessions.has(id)) throw new Error('session id not found or wrong type')
        if (action == null) throw new Error('action not found or wrong type')

        const tracer = this.sessions.get(id).tracer
        let result: any
        try {
            if (action === 'getState') result = tracer.getState()
            else if (action === 'start') result = await tracer.start()
            else if (action === 'stop') result = tracer.stop()
            else if (action === 'input') {
                const data = args[0] as string
                if (data == null) throw new Error('input not found in args or wrong type')
                result = tracer.input(data)
            } else if (action === 'step') result = await tracer.step()
            else if (action === 'stepOver') result = await tracer.stepOver()
            else if (action === 'stepOut') result = await tracer.stepOut()
            else if (action === 'continue') result = await tracer.continue()
            else if (action === 'getBreakpoints') result = tracer.getBreakpoints()
            else if (action === 'setBreakpoints') {
                const line = args[0] as number
                if (line == null) throw new Error('line not found in args or wrong type')
                result = tracer.setBreakpoint(line)
            } else throw new Error('action not found or wrong type')
        } catch (error) {
            throw error
        } finally {
            if (tracer.getState() === 'stopped') this.sessions.delete(id)
        }
        return result
    }

    /**
     * Starts the server.
     */
    listen() {
        this.server.listen(this.port)
    }
}
