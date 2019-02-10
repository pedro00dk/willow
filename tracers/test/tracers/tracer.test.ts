import { TracerProcess } from '../../src/tracer/tracer-process'


function createCommandWithCommand(tracerCommand: string, code: string) {
    return tracerCommand.indexOf('{}') !== -1
        ? tracerCommand.replace(/{}/, `'${code.replace(/'/g, '\'"\'"\'')}'`)
        : `${tracerCommand} '${code.replace(/'/g, '\'"\'"\'')}'`
}

const tracers = [
    ['java', process.env.npm_package_config_java_supplier],
    ['python', process.env.npm_package_config_python_supplier]
]

const codes = {
    java: {
        broken: '!@#$%*()',
        working: 'public class Main { public static void main(String[] args) { } }'
    },
    python: {
        broken: '!@#$%*()',
        working: ''
    }
}

tracers.forEach(([tracer, command]) => {
    describe(
        tracer,
        () => {
            const brokenCode = codes[tracer]['broken']
            const workingCode = codes[tracer]['working']
            const commandWithBrokenCode = createCommandWithCommand(command, brokenCode)
            const commandWithWorkingCode = createCommandWithCommand(command, workingCode)

            describe(
                'create and stop the tracer without spawn the process',
                () => {
                    test(
                        'create - stop(2)',
                        () => {
                            const tracerProcess = new TracerProcess(commandWithWorkingCode)
                            expect(tracerProcess.getState()).toBe('created')
                            expect(tracerProcess.stop()).toBeUndefined()
                            expect(tracerProcess.getState()).toBe('stopped')
                            expect(() => tracerProcess.stop()).toThrowError()
                        }
                    )
                }
            )

            describe(
                'test working code',
                () => {
                    test(
                        'create - start - stop',
                        async () => {
                            const tracerProcess = new TracerProcess(commandWithWorkingCode)
                            expect(await tracerProcess.start()).toMatchObject([{ name: 'started' }])
                            expect(tracerProcess.getState()).toBe('started')
                            expect(tracerProcess.stop()).toBeUndefined()
                            expect(tracerProcess.getState()).toBe('stopped')
                        }
                    )

                    test(
                        'create - start - step(*)',
                        async () => {
                            const tracerProcess = new TracerProcess(commandWithWorkingCode)
                            expect(await tracerProcess.start()).toMatchObject([{ name: 'started' }])
                            expect(tracerProcess.getState()).toBe('started')
                            while (tracerProcess.getState() !== 'stopped') {
                                const results = await tracerProcess.step()
                                expect(results).toBeInstanceOf(Array)
                                expect(results.length).toBeGreaterThan(0)
                            }
                            expect(tracerProcess.getState()).toBe('stopped')
                        }
                    )

                    test(
                        'create - start - step(1) - stop',
                        async () => {
                            const tracerProcess = new TracerProcess(commandWithWorkingCode)
                            expect(await tracerProcess.start()).toMatchObject([{ name: 'started' }])
                            expect(tracerProcess.getState()).toBe('started')
                            const results = await tracerProcess.step()
                            expect(results).toBeInstanceOf(Array)
                            expect(results.length).toBeGreaterThan(0)
                            expect(tracerProcess.stop()).toBeUndefined()
                            expect(tracerProcess.getState()).toBe('stopped')
                        }
                    )
                }
            )

            describe(
                'test broken code',
                () => {
                    test(
                        'create - start - stop',
                        async () => {
                            const tracerProcess = new TracerProcess(commandWithBrokenCode)
                            expect(await tracerProcess.start()).toMatchObject([{ name: 'error' }])
                            expect(tracerProcess.getState()).toBe('stopped')
                            expect(() => tracerProcess.stop()).toThrowError()
                        }
                    )
                }
            )

        }
    )
})

