import * as express from 'express'
import * as session from 'express-session'


/**
 * Server to willow actions.
 */
export class Server {
    private server: express.Express
    private port: number

    /**
     * Creates the server with the port and the secret.
     */
    constructor(port: number, secret: string) {
        if (port < 0 || port > 65355) throw new Error('illegal port number')
        if (secret == undefined) throw new Error('secret not found')

        this.server = express()
        this.server.use(express.json())
        this.server.use(session({ resave: false, saveUninitialized: true, secret }))

        this.port = port

        this.configureRoutes()
    }

    /**
     * Configures server routes.
     */
    private configureRoutes() {
        this.server.get('/session', (request, response) => response.send(request.session.id))
    }

    /**
     * Starts the server.
     */
    listen() {
        this.server.listen(this.port)
    }
}
