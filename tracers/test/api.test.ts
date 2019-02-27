import { createTracerSuppliers } from '../src/index'
import { Server } from '../src/server'


test(
    'suppliers - empty',
    () => {
        const server = new Server(8000, new Map())
        expect(server.getSuppliers()).toEqual([])
    }
)

test(
    'suppliers',
    () => {
        const suppliers = createTracerSuppliers([
            'java',
            process.env.npm_package_config_java_supplier,
            'python',
            process.env.npm_package_config_python_supplier

        ])
        const server = new Server(8000, suppliers)
        expect(server.getSuppliers()).toEqual(['java', 'python'])
    }
)

test(
    'sessions',
    () => {
        const server = new Server(8000, new Map())
        expect(server.getSessions()).toEqual([])
    }
)

describe(
    'tracer - create -> stop',
    () => {
        const suppliers = createTracerSuppliers([
            'java',
            process.env.npm_package_config_java_supplier,
            'python',
            process.env.npm_package_config_python_supplier

        ])
        const server = new Server(8000, suppliers)
        for (const supplier of server.getSuppliers()) {
            test(
                `tracer process (${supplier})`,
                async () => {
                    const session = server.createSession(supplier, '!@#$% some wrong code %$#@!')
                    expect(session.supplier).toEqual(supplier)
                    expect(server.getSessions()[0].id).toEqual(session.id)
                    expect(await server.executeOnSession(session.id, 'stop', [])).toBeUndefined()
                    expect(server.getSessions()).toEqual([])
                }
            )
        }
    }
)

describe(
    'tracer - create -> start -> error(stop)',
    () => {
        const suppliers = createTracerSuppliers([
            'java',
            process.env.npm_package_config_java_supplier,
            'python',
            process.env.npm_package_config_python_supplier

        ])
        const server = new Server(8000, suppliers)
        for (const supplier of server.getSuppliers()) {
            test(
                `tracer process (${supplier})`,
                async () => {
                    const session = server.createSession(supplier, '!@#$% some wrong code %$#@!')
                    expect(session.supplier).toEqual(supplier)
                    expect(server.getSessions()[0].id).toEqual(session.id)
                    expect(await server.executeOnSession(session.id, 'start', [])).toMatchObject([{ name: 'error' }])
                    expect(server.getSessions()).toEqual([])
                }
            )
        }
    }
)

describe(
    'tracer (test) - create -> start -> step -> stop',
    () => {
        const suppliers = createTracerSuppliers([
            'java',
            process.env.npm_package_config_java_supplier_test,
            'python',
            process.env.npm_package_config_python_supplier_test

        ])
        const server = new Server(8000, suppliers)
        for (const supplier of server.getSuppliers()) {
            test(
                `tracer process (${supplier})`,
                async () => {
                    const session = server.createSession(supplier, '!@#$% ignored code %$#@!')
                    expect(session.supplier).toEqual(supplier)
                    expect(await server.executeOnSession(session.id, 'start', [])).toMatchObject([{ name: 'started' }])
                    expect(await server.executeOnSession(session.id, 'stop', [])).toBeUndefined()
                }
            )
        }
    }
)
