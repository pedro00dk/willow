import * as express from 'express'
import * as session from 'express-session'
import * as log from 'npmlog'
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
    constructor(port: number, secret: string, clients: string, tracerServerAddress: string) {
        this.server = express()
        this.server.use(express.json())
        this.server.use(session({ resave: false, saveUninitialized: true, secret }))
        this.server.use((request, response, next) => {
            // cors support with any origin (wildcard '*' not supported when credentials enabled)
            const origin = clients !== '*' ? clients : ([request.headers.origin].flat()[0] as string)
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
        this.server.get('/session', (request, response) => {
            log.http(Server.name, request.path)
            response.send({ session: request.session.id })
        })
        this.server.get('/tracers/suppliers', (request, response) => {
            log.http(Server.name, request.path)
            try {
                response.send(this.getSuppliers())
            } catch (error) {
                response.status(400).send(error.message)
            }
        })
        this.server.post('/tracers/create', async (request, response) => {
            const userId = request.session.id
            const supplier = request.body['supplier'] as string
            const code = request.body['code'] as string
            log.http(Server.name, request.path, { userId, supplier })
            try {
                response.send(await this.createSession(userId, supplier, code))
            } catch (error) {
                response.status(400).send(error.message)
            }
        })
        this.server.post('/tracers/execute', async (request, response) => {
            const userId = request.session.id
            const action = request.body['action'] as string
            const args = request.body['args'] as unknown[]
            log.http(Server.name, request.path, { userId, action })
            try {
                response.send(await this.executeOnSession(userId, action, args))
            } catch (error) {
                response.status(400).send(error.message)
            }
        })
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
            log.info(Server.name, 'removed previous session', { userId, tracerId })
        }
        const { id } = await this.tracersClient.create(supplier, code)
        log.info(Server.name, 'created session', { userId, tracerId: id, supplier })
        this.usersTracers.set(userId, id)
    }

    /**
     * Executes on the received session tracer an action correspondent to a tracer methods with the received args.
     */
    async executeOnSession(userId: string, action: string, args: unknown[]) {
        if (!this.usersTracers.has(userId)) {
            const error = 'user has no tracer associated'
            log.warn(Server.name, error, { userId })
            throw new Error(error)
        }
        const tracerId = this.usersTracers.get(userId)
        const { data, finished } = await this.tracersClient.execute(tracerId, action, args)
        if (finished) {
            log.info(Server.name, 'tracer stopped', { userId, tracerId })
            this.usersTracers.delete(userId)
        }
        log.info(Server.name, 'executed', { userId, tracerId, action, finished })
        return data
    }

    /**
     * Starts the server.
     */
    listen() {
        log.info(Server.name, 'start listening', { port: this.port })
        this.server.listen(this.port)
    }
}
