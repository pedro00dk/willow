import * as express from 'express'
import * as log from 'npmlog'
import { TracersSkeleton } from './tracers-skeleton'

/**
 * Server to expose tracers through http.
 */
export class Server {
    private server: express.Express
    private service: TracersSkeleton

    constructor(private port: number, tracers: { [language: string]: string }) {
        this.server = express()
        this.service = new TracersSkeleton(tracers, 'sh')
        this.server.use('/tracers', this.service.router)
    }

    listen() {
        log.info(Server.name, 'listen', { port: this.port })
        this.server.listen(this.port)
    }
}
