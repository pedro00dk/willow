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
        return (await axios.get(`${this.address}/suppliers`)).data as string[]
    }

    /**
     * Returns the tracer server sessions.
     */
    async getSessions() {
        return (await axios.get(`${this.address}/sessions`)).data as { id: number, supplier: string, state: string }[]
    }

    /**
     * Creates a new tracer in the tracer server and returns its id.
     */
    async create(supplier: string, code: string) {
        return (await axios.post(`${this.address}/create`, { supplier, code })).data as { id: number, supplier: string }
    }

    /**
     * Executes a command in the tracer refereed by the received id and returns the result.
     */
    async execute(id: number, action: string, args: unknown[]) {
        return (await axios.post(`${this.address}/execute`, { id, action, args })).data as unknown
    }
}
