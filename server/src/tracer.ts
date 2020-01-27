import cp from 'child_process'
import * as schema from './schema/schema'

/**
 * Proxy that spawns and connects to a tracer process.
 */
export class Tracer {
    /**
     * Create the tracer proxy.
     *
     * @param command the shell command used to start the tracer.
     */
    constructor(private readonly command: string) {}

    /**
     * Spawn tracer using the command and send the trace request to it and wait the result.
     * If the tracer finishes before timeout, returns the result.
     * If the tracer writes any error in the error stream, throws the error content.
     * If the tracer does not finish before the timeout, throws a reached timeout.
     * This function might also fail if the trace result is not JSON parsable.
     *
     * @param trace the tracer object containing source, input and steps
     * @param timeout the maximum execution time in milliseconds
     */
    async run(trace: schema.Trace, timeout: number) {
        const tracer = cp.spawn(this.command, { shell: true })

        const stopPromise = new Promise((resolve, reject) => {
            tracer.on('close', (code, signal) => resolve())
            setTimeout(() => reject(new Error(`reached timeout ${timeout}ms`)), timeout)
        })

        const stdoutBuffers: Buffer[] = []
        const stderrBuffers: Buffer[] = []
        tracer.stdout.on('data', chunk => stdoutBuffers.push(chunk))
        tracer.stderr.on('data', chunk => stderrBuffers.push(chunk))
        tracer.stdin.end(JSON.stringify(trace, undefined, 0))

        try {
            await stopPromise // may throw timeout error
        } finally {
            tracer.kill()
        }
        if (stderrBuffers.length > 0) throw new Error(Buffer.concat(stderrBuffers).toString('utf-8'))
        return JSON.parse(Buffer.concat(stdoutBuffers).toString('utf-8')) as schema.Result
    }
}
