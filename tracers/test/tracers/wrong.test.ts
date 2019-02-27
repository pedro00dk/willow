import { TracerProcess } from '../../src/tracer/tracer-process'


function createCommandWithCommand(tracerCommand: string, code: string) {
    return tracerCommand.indexOf('{}') !== -1
        ? tracerCommand.replace(/{}/, `'${code.replace(/'/g, '\'"\'"\'')}'`)
        : `${tracerCommand} '${code.replace(/'/g, '\'"\'"\'')}'`
}

describe(
    'insistent invalid command',
    () => {
        const command = 'some invalid command {}'
        const code = ''
        const wrongCommandWithCode = createCommandWithCommand(command, code)
        test(
            'create - start',
            async () => {
                const tracerProcess = new TracerProcess(wrongCommandWithCode)
                try {
                    const never = await tracerProcess.start()
                } catch (error) {
                    expect(error).toBeInstanceOf(Error)

                }
                expect(tracerProcess.getState()).toBe('stopped')
            }
        )
    }
)

describe(
    'existent invalid command',
    () => {
        const command = '/bin/bash {}'
        const code = ''
        const wrongCommandWithCode = createCommandWithCommand(command, code)
        test(
            'create - start',
            async () => {
                const tracerProcess = new TracerProcess(wrongCommandWithCode)
                try {
                    const never = await tracerProcess.start()
                } catch (error) {
                    expect(error).toBeInstanceOf(Error)

                }
                expect(tracerProcess.getState()).toBe('stopped')
            }
        )
    }
)
