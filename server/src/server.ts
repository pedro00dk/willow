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
        this.server.use((request, response, next) => {
            // cors support with any origin (wildcard '*' not supported when credentials enabled)
            const origin = [request.headers.origin].flat()[0] as string
            response.header('Access-Control-Allow-Origin', origin)
            response.header('Access-Control-Allow-Credentials', 'true')
            next()
        })

        this.port = port

        this.configureRoutes()
    }

    /**
     * Configures server routes.
     */
    private configureRoutes() {
        this.server.get('/session', (request, response) => response.send({ session: request.session.id }))
    }

    /**
     * Starts the server.
     */
    listen() {
        this.server.listen(this.port)
    }
}
