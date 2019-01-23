import { MultiplexProcess, ProcessResponse } from '../process/multiplex-process'
import { isErrorResult, isLastResult, Result } from '../result'
import { Tracer } from './tracer'


/**
 * Connects to a tracer process.
 */
export class TracerProcess implements Tracer {
    private multiplexProcess: MultiplexProcess
    private state: 'created' | 'started' | 'stopped'

    /**
     * Initializes the client with the command to spawn the process.
     */
    constructor(command: string) {
        this.multiplexProcess = new MultiplexProcess(command)
        this.state = 'created'
    }

    /**
     * Throws an exception if the tracer state is not in the expected states list.
     */
    private requireState(...states: Array<typeof TracerProcess.prototype.state>) {
        if (!states.includes(this.state))
            throw new Error(`unexpected tracer state: ${this.state}, expected one of: ${states}`)
    }

    /**
     * Checks if the process response are tracer results.
     */
    private processResponseAsTracerResults(response: ProcessResponse) {
        if (response.source === 'stderr') {
            this.stop()
            throw new Error(`process stderr: ${response.value}`)
        }
        if (!response.value.startsWith('[')) {
            this.stop()
            throw new Error(`process stdout: non json array result (${response.value})`)
        }
        try {
            return JSON.parse(response.value) as Result[]
        } catch (error) {
            this.stop()
            throw new SyntaxError(`process stdout: ${error.message}`)
        }
    }

    getState() {
        return this.state
    }

    async start() {
        this.requireState('created')

        this.multiplexProcess.spawn()
        this.processResponseAsTracerResults(await this.multiplexProcess.read())

        const response = await this.multiplexProcess.question('start')
        const results = this.processResponseAsTracerResults(response)
        this.state = 'started'
        if (isErrorResult(results[results.length - 1])) this.stop()
        return results
    }

    stop() {
        this.requireState('started', 'created')

        try {
            this.multiplexProcess.write('stop')
            this.multiplexProcess.kill()
        }
        catch (error) { /* ignored */ }
        this.state = 'stopped'
        this.multiplexProcess = null
    }

    input(input: string) {
        this.requireState('started')

        this.multiplexProcess.write(`input ${input}`)
    }

    async step() {
        this.requireState('started')

        const response = await this.multiplexProcess.question('step')
        const results = this.processResponseAsTracerResults(response)
        if (isLastResult(results[results.length - 1]) || isErrorResult(results[results.length - 1])) this.stop()
        return results
    }
}
