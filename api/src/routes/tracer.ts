import cp from 'child_process'
import express from 'express'
import * as schema from '../schema/schema'

/**
 * Create the handlers for spawning tracer processes and executing traces.
 * Check parameters documentation in server.ts.
 *
 * @template T user type
 */
export const createHandlers = <T>(
    tracers: { commands: { [language: string]: string }; steps: number; timeout: number },
    signed: { steps: number; timeout: number },
    verbose: boolean
) => {
    const router = express.Router()
    const tracerLanguages = Object.keys(tracers.commands)

    router.get('/languages', (req, res) => {
        console.log('http', req.path, tracerLanguages)
        res.send(tracerLanguages)
    })

    router.post('/trace', async (req, res) => {
        const user = req.user as T
        const language = req.body['language'] as string
        const steps = user ? signed.steps : tracers.steps
        const timeout = user ? signed.timeout : tracers.timeout
        const trace = { source: req.body['source'] as string, input: req.body['input'] as string, steps }
        console.log('http', req.path, user, language, steps, timeout, verbose ? trace : '')
        try {
            if (!tracers.commands[language]) throw new Error(`Language ${language} is not available`)
            const result = await runTracer(tracers.commands[language], trace, timeout)
            res.send(result)
            console.log('http', req.path, 'ok', verbose ? result : '')
        } catch (error) {
            res.status(400)
            res.send(error.message)
            console.log('http', req.path, 'error', error.message)
        }
    })

    return { handlers: [] as express.Handler[], router }
}

/**
 * Spawn tracer process using the received shell command, send the trace request to it and wait the trace result.
 * If the tracer finishes before timeout, returns the result.
 * If the tracer writes any error in the error stream, throws the error content.
 * If the tracer does not finish before the timeout, throws a reached timeout.
 * This function might also fail if the trace result is not JSON parsable.
 *
 * @param command any shell command that accepts the trace request as a JSON serialized string through standard input
 *                stream, outputs the result to the standard output stream and errors to the standard error stream
 * @param trace the trace object
 * @param timeout the maximum execution time in milliseconds
 */
export const runTracer = async (command: string, trace: schema.Trace, timeout: number) => {
    const tracer = cp.spawn(command, { shell: true })

    const stopPromise = new Promise((resolve, reject) => {
        tracer.on('close', (code, signal) => resolve())
        setTimeout(() => reject(new Error(`Trace took longer than ${timeout}ms to execute`)), timeout)
    })

    const stdoutBuffers: Buffer[] = []
    const stderrBuffers: Buffer[] = []
    tracer.stdout.on('data', chunk => stdoutBuffers.push(chunk))
    tracer.stderr.on('data', chunk => stderrBuffers.push(chunk))
    tracer.stdin.end(JSON.stringify(trace, undefined, 0))

    try {
        await stopPromise
    } finally {
        tracer.kill()
    }
    if (stderrBuffers.length > 0) throw new Error(Buffer.concat(stderrBuffers).toString('utf-8'))
    return JSON.parse(Buffer.concat(stdoutBuffers).toString('utf-8')) as schema.Result
}
