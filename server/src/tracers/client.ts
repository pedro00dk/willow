import axios from 'axios'


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
            return response.data as string[]
        } catch (error) {
            throw new Error(error.response ? error.response.data : error.toString())
        }
    }

    /**
     * Returns the tracer server sessions.
     */
    async getSessions() {
        try {
            const response = await axios.get(`${this.address}/sessions`)
            return response.data as { id: number, supplier: string, state: string }[]
        } catch (error) {
            throw new Error(error.response ? error.response.data : error.toString())
        }
    }

    /**
     * Creates a new tracer in the tracer server and returns its id.
     */
    async create(supplier: string, code: string) {
        try {
            const response = await axios.post(`${this.address}/create`, { supplier, code })
            return response.data as { id: number, supplier: string }
        } catch (error) {
            throw new Error(error.response ? error.response.data : error.toString())
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
            return { data: response.data as string, finished: response.headers.finished === 'true' }
        } catch (error) {
            throw new Error(error.response ? error.response.data : error.toString())
        }
    }
}
