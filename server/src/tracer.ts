import * as cp from 'child_process'
import * as schema from './schema/schema'

/**
 * Spawns and connects to a tracer process.
 */
export class Tracer {
    constructor(private readonly command: string) {}

    async run(trace: schema.Trace, timeout: number) {
        const tracer = cp.spawn(this.command, { shell: true })

        const stopPromise = new Promise((res, rej) => {
            tracer.on('close', (code, signal) => res())
            setTimeout(() => rej(new Error(`reached timeout ${timeout}ms`)), timeout)
        })

        const stdoutBuffers: Buffer[] = []
        const stderrBuffers: Buffer[] = []
        tracer.stdout.on('data', chunk => stdoutBuffers.push(chunk))
        tracer.stderr.on('data', chunk => stderrBuffers.push(chunk))
        tracer.stdin.end(JSON.stringify(trace, undefined, 0))

        try {
            await stopPromise
        } catch (error) {
            return { steps: [{ threw: { cause: error.message } }] } as schema.Result
        } finally {
            if (!tracer.killed) tracer.kill()
        }

        if (stderrBuffers.length > 0) throw new Error(Buffer.concat(stderrBuffers).toString('utf-8'))
        return JSON.parse(Buffer.concat(stdoutBuffers).toString('utf-8')) as schema.Result
    }
}
