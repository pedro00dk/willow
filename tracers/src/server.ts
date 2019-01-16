import * as express from 'express'

import { Tracer, DefaultTracer } from './tracer/tracer'


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
        if (port < 0 || port > 65355) throw 'Illegal port number'

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
                let supplier = request.body['supplier'] as string
                let code = request.body['code'] as string
                try { response.send(this.createSession(supplier, code)) }
                catch (error) { response.status(400).send(error) }
            }
        )
        this.server.post(
            '/execute',
            async (request, response) => {
                let id = request.body['id'] as number
                let action = request.body['action'] as string
                let args = request.body['args'] as Array<any>
                try { response.send(await this.executeOnSession(id, action, args)) }
                catch (error) { response.status(400).send(error) }
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
            .map(([id, { supplier }]) => ({ id, supplier }))
    }

    /**
     * Creates a new tracer session with the received supplier and code.
     */
    private createSession(supplier: string, code: string) {
        if (supplier == null) throw 'supplier not found or wrong type'
        if (code == null) throw 'code not found or wrong type'
        if (!this.suppliers.has(supplier)) throw `supplier ${supplier} not found`

        let id = this.sessionIdGenerator++
        let tracer = this.suppliers.get(supplier)(code)
        tracer = tracer instanceof DefaultTracer ? tracer : new DefaultTracer(tracer)

        this.sessions.set(id, { supplier, tracer })
        return { id, supplier }
    }

    /**
     * Executes on the received session tracer an action correspondent to a tracer methods with the received args.
     */
    private async executeOnSession(id: number, action: string, args: Array<any>) {
        if (id == null || !this.sessions.has(id)) throw 'session id not found or wrong type'
        if (action == null) throw 'action not found or wrong type'

        let result = this.sessions.get(id).tracer[action](...(args != null ? args : []))
        return result instanceof Promise ? await result : result
    }

    /**
     * Starts the server.
     */
    listen() {
        this.server.listen(this.port)
    }
}