import * as express from 'express'

import { Tracer } from './tracer/tracer'


/**
 * Server to expose tracers through http.
 */
export class TracerServer {
    private server: express.Express
    private port: number
    private suppliers: Map<string, (code: string) => Tracer>
    private sessions: Map<number, { supplier: string, tracer: Tracer }>

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

        this.configureRoutes()
    }

    /**
     * Configures server routes.
     */
    private configureRoutes() {
        this.server.get('/suppliers', (request, response) => response.send(this.getSuppliers()))
        this.server.get('/sessions', (request, response) => response.send(this.getSessions()))
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
            .map(([session, { supplier }]) => ({ session, supplier }))
    }

    /**
     * Starts the server.
     */
    listen() {
        this.server.listen(this.port)
    }
}