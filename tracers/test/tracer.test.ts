import * as protocol from '../src/protobuf/protocol'
import { TracerProcess } from '../src/tracer/tracer-process'
import { TracerWrapper } from '../src/tracer/tracer-wrapper'

const tracers = process.argv
    .map((arg, i) => [arg, i] as [string, number])
    .filter(([arg, i]) => arg === '--tracer')
    .map(([arg, i]) => ({
        language: process.argv[i + 1],
        command: process.argv[i + 2],
        working: protocol.Action.Start.create({ main: process.argv[i + 3], code: process.argv[i + 4] }),
        broken: protocol.Action.Start.create({ main: process.argv[i + 3], code: process.argv[i + 5] })
    }))

Object.values(tracers).forEach(({ language, command, working, broken }) => {
    describe(`tracer process -- ${language}`, () => {
        test('create - stop(fail)', () => {
            const tracer = new TracerProcess(command)
            expect(tracer.getState()).toBe('created')
            expect(() => tracer.stop()).toThrow()
        })
        test('create - start(working code) - stop', async () => {
            const tracer = new TracerProcess(command)
            await expect(tracer.start(working)).resolves.toBeDefined()
            expect(tracer.getState()).toBe('started')
            expect(() => tracer.stop()).not.toThrow()
        })
        test('create - start(working code) step - stop', async () => {
            const tracer = new TracerProcess(command)
            await tracer.start(working)
            await expect(tracer.step()).resolves.toBeDefined()
            expect(() => tracer.stop()).not.toThrow()
        })
        test('create - start(working code) step* - step(fail) - stop(fail)', async () => {
            const tracer = new TracerProcess(command)
            await tracer.start(working)
            while (true) {
                try {
                    await tracer.step()
                } catch (error) {
                    break
                }
            }
            expect(tracer.getState()).toBe('stopped')
            await expect(tracer.step()).rejects.toBeDefined()
            expect(() => tracer.stop()).toThrow()
        })
        test('create - start(broken code) step(fail) - stop(fail)', async () => {
            const tracer = new TracerProcess(command)
            await tracer.start(broken)
            expect(tracer.getState()).toBe('stopped')
            await expect(tracer.step()).rejects.toBeDefined()
            expect(() => tracer.stop()).toThrow()
        })
    })
})

Object.entries(tracers).forEach(([language, { command, working }]) => {
    describe(`tracer wrapper -- ${language}`, () => {
        test('step over', async () => {
            const tracer = new TracerWrapper(new TracerProcess(command))
            await tracer.start(working)
            expect(() => tracer.stepOver()).not.toThrow()
            expect(tracer.getState()).toBe('started')
        })
        test('step out', async () => {
            const tracer = new TracerWrapper(new TracerProcess(command))
            await tracer.start(working)
            expect(() => tracer.stepOut()).not.toThrow()
        })
        test('continue', async () => {
            const tracer = new TracerWrapper(new TracerProcess(command))
            await tracer.start(working)
            expect(() => tracer.continue()).not.toThrow()
        })
    })
})
