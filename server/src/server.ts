import * as express from 'express'
import * as session from 'express-session'
import { Client } from './tracers/client'


/**
 * Server to willow actions.
 */
export class Server {
    private server: express.Express
    private port: number
    private tracersClient: Client
    private usersTracers: Map<string, number>

    /**
     * Creates the server with the port and the secret.
     */
    constructor(port: number, secret: string, tracerServerAddress: string) {
        if (port < 0 || port > 65355) throw new Error('illegal port number')
        if (secret == undefined) throw new Error('secret not found')
        if (tracerServerAddress == undefined) throw new Error('tracerServerAddress not found')

        this.server = express()
        this.server.use(express.json())
        this.server.use(session({ resave: false, saveUninitialized: true, secret }))
        this.server.use((request, response, next) => {
            // cors support with any origin (wildcard '*' not supported when credentials enabled)
            const origin = [request.headers.origin].flat()[0] as string
            response.header('Access-Control-Allow-Origin', origin)
            response.header('Access-Control-Allow-Credentials', 'true')
            response.header('Access-Control-Allow-Headers', 'Content-Type')
            next()
        })

        this.port = port
        this.tracersClient = new Client(tracerServerAddress)
        this.usersTracers = new Map()

        this.configureRoutes()
    }

    /**
     * Configures server routes.
     */
    private configureRoutes() {
        this.server.get(
            '/session',
            (request, response) => {
                response.send({ session: request.session.id })
            }
        )
        this.server.get(
            '/tracers/suppliers',
            (request, response) => {
                try {
                    response.send(this.getSuppliers())
                } catch (error) {
                    response.status(400).send(error.message)
                }
            }
        )
        this.server.post(
            '/tracers/create',
            async (request, response) => {
                const userId = request.session.id
                const supplier = request.body['supplier'] as string
                const code = request.body['code'] as string
                try {
                    response.send(await this.createSession(userId, supplier, code))
                } catch (error) {
                    response.status(400).send(error.message)
                }
            }
        )
        this.server.post(
            '/tracers/execute',
            async (request, response) => {
                const userId = request.session.id
                const action = request.body['action'] as string
                const args = request.body['args'] as unknown[]
                try {
                    response.send(await this.executeOnSession(userId, action, args))
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
        return this.tracersClient.getSuppliers()
    }

    /**
     * Creates a new tracer session linked with the userId, with the received supplier and code.
     */
    async createSession(userId: string, supplier: string, code: string) {
        if (this.usersTracers.has(userId)) {
            const tracerId = this.usersTracers.get(userId)
            await this.tracersClient.execute(tracerId, 'stop', [])
        }
        const { id } = await this.tracersClient.create(supplier, code)
        this.usersTracers.set(userId, id)
    }

    /**
     * Executes on the received session tracer an action correspondent to a tracer methods with the received args.
     */
    async executeOnSession(userId: string, action: string, args: unknown[]) {
        if (!this.usersTracers.has(userId)) throw new Error('user has no tracer associated')
        const tracerId = this.usersTracers.get(userId)
        const { data, finished } = await this.tracersClient.execute(tracerId, action, args)
        if (finished) this.usersTracers.delete(userId)
        return data
    }

    /**
     * Starts the server.
     */
    listen() {
        this.server.listen(this.port)
    }
}
