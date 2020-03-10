import { runTracer } from '../src/routes/tracer'

const tracers = Object.entries(process.env)
    .filter(([key]) => key.startsWith('TRACER_'))
    .map(([key, data]) => [key.substring('TRACER_'.length), data.split('#')] as const)
    .map(([key, data]) => ({
        language: key.toLowerCase(),
        command: data[0],
        working: { source: data[1], input: '', steps: 1000 },
        broken: { source: data[2], input: '', steps: 1000 }
    }))

Object.values(tracers).forEach(({ language, command, working, broken }) => {
    describe(`tracer -- ${language}`, () => {
        test('working code', async () => {
            await expect(runTracer(command, working, 5000)).resolves.toBeDefined()
        })

        test('broken code', async () => {
            await expect(runTracer(command, broken, 5000)).resolves.toBeDefined()
        })

        test('max steps', async () => {
            await expect(runTracer(command, { ...working, steps: 0 }, 5000)).resolves.toBeDefined()
        })

        test('elapsed timeout', async () => {
            await expect(runTracer(command, working, 0)).resolves.toBeDefined()
        })
    })
})
