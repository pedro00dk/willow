import * as protocol from '../src/protobuf/protocol'
import { Tracer } from '../src/tracer'

const tracers = process.argv
    .map((arg, i) => [arg, i] as [string, number])
    .filter(([arg, i]) => arg === '--tracer')
    .map(([arg, i]) => ({
        language: process.argv[i + 1],
        command: process.argv[i + 2],
        working: protocol.Trace.create({ source: process.argv[i + 3], input: '', steps: 1000 }),
        broken: protocol.Trace.create({ source: process.argv[i + 4], input: '', steps: 1000 })
    }))

Object.values(tracers).forEach(({ language, command, working, broken }) => {
    describe(`tracer -- ${language}`, () => {
        test('run working', () => {
            const tracer = new Tracer(command, 'sh', working, 5)
            expect(tracer.run()).resolves.toBeDefined()
        })

        test('run broken', async () => {
            const tracer = new Tracer(command, 'sh', broken, 5)
            await expect(tracer.run()).resolves.toBeDefined()
        })
    })
})
