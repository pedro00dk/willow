import axios from 'axios'
import * as log from 'npmlog'


/**
 * Client for a tracer server.
 */
export class Client {
    private address: string

    /**
     * Creates the client with the received server address.
     */
    constructor(address: string) {
        this.address = address
    }

    /**
     * Returns the tracer server suppliers.
     */
    async getSuppliers() {
        try {
            const response = await axios.get(`${this.address}/suppliers`)
            log.info(Client.name, 'get suppliers', { status: response.status })
            return response.data as string[]
        } catch (error) {
            const error_ = error.response ? error.response.data : error.toString()
            log.info(Client.name, 'get suppliers', error_)
            throw new Error(error_)
        }
    }

    /**
     * Returns the tracer server sessions.
     */
    async getSessions() {
        try {
            const response = await axios.get(`${this.address}/sessions`)
            log.info(Client.name, 'get sessions', { status: response.status })
            return response.data as { id: number, supplier: string, state: string }[]
        } catch (error) {
            const error_ = error.response ? error.response.data : error.toString()
            log.info(Client.name, 'get sessions', error_)
            throw new Error(error_)
        }
    }

    /**
     * Creates a new tracer in the tracer server and returns its id.
     */
    async create(supplier: string, code: string) {
        try {
            const response = await axios.post(`${this.address}/create`, { supplier, code })
            log.info(Client.name, 'create', { status: response.status })
            return response.data as { id: number, supplier: string }
        } catch (error) {
            const error_ = error.response ? error.response.data : error.toString()
            log.info(Client.name, 'create', error_)
            throw new Error(error_)
        }
    }

    /**
     * Executes a command in the tracer refereed by the received id and returns the result.
     */
    async execute(id: number, action: string, args: unknown[]) {
        try {
            const response = await axios.post(
                `${this.address}/execute`, { id, action, args }, { transformResponse: res => res }
            )
            log.info(Client.name, 'execute', { status: response.status })
            return { data: response.data as string, finished: response.headers.finished === 'true' }
        } catch (error) {
            const error_ = error.response ? error.response.data : error.toString()
            log.info(Client.name, 'execute', error_)
            throw new Error(error_)
        }
    }
}
