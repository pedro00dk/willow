import { Server } from '../src/server'


test(
    'suppliers - empty',
    () => {
        const server = new Server(8000, new Map())
        expect(server.getSuppliers()).toEqual([])
    }
)
