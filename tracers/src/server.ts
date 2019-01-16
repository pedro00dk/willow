import * as express from 'express'

import { Tracer } from './tracer/tracer'


/**
 * Server to expose tracers through http.
 */
export class TracerServer {
    private server: express.Express
    private port: number
    private suppliers: Map<string, (code: string) => Tracer>

    /**
     * Creates the server with the port and the tracer suppliers.
     */
    constructor(port: number, suppliers: Map<string, (code: string) => Tracer>) {
        if (port < 0 || port > 65355) throw 'Illegal port number'

        this.server = express()
        this.server.use(express.json())

        this.port = port
        this.suppliers = suppliers
    }

    /**
     * Starts the server.
     */
    listen() {
        this.server.listen(this.port)
    }
}