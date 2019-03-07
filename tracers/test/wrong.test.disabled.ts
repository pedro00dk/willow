import { TracerProcess } from '../src/tracer/tracer-process'


test(
    'command not found',
    async () => {
        const tracerProcess = new TracerProcess('command_not_found')
        expect(tracerProcess.start('', '')).rejects.toThrow()
        expect(tracerProcess.getState()).toBe('stopped')
    }
)

test(
    'command not tracer 1',
    async () => {
        const tracerProcess = new TracerProcess('/bin/bash')
        expect(tracerProcess.start('', '')).rejects.toThrow()
        expect(tracerProcess.getState()).toBe('stopped')
    }
)

test(
    'command not tracer 2',
    async () => {
        const tracerProcess = new TracerProcess('/bin/cat')
        expect(tracerProcess.start('', '')).rejects.toThrow()
        expect(tracerProcess.getState()).toBe('stopped')
    }
)
