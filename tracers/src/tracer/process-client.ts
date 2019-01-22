import * as cp from 'child_process'
import * as rx from 'rxjs'
import * as rxOps from 'rxjs/operators'
import { Writable } from 'stream'

import { isErrorResult, isLastResult, Result } from '../result'
import { Tracer } from './tracer'


/**
 * Connects to a tracer process.
 */
export class ProcessClient implements Tracer {
    private command: string
    private state: 'created' | 'started' | 'stopped'
    private instance: cp.ChildProcess
    private stdin: Writable
    private stdStreamsGenerator: AsyncIterableIterator<{ source: string, value: string }>


    /**
     * Initializes the client with the command to spawn the process.
     */
    constructor(command: string) {
        this.command = command
        this.state = 'created'
    }

    /**
     * Throws an exception if the tracer state is not in the expected states list.
     */
    private requireState(...states: Array<typeof ProcessClient.prototype.state>) {
        if (!states.includes(this.state))
            throw new Error(`unexpected tracer state: ${this.state}, expected one of: ${states}`)
    }

    /**
     * Spawns the tracer server process.
     */
    private async spawn() {
        this.instance = cp.spawn(this.command, { shell: true })
        this.stdin = this.instance.stdin

        const observableAnyToLines =
            (observable: rx.Observable<any>) => observable
                .pipe(
                    rxOps.map(object => object as Buffer),
                    rxOps.map(buffer => buffer.toString('utf8')),
                    rxOps.flatMap(text => rx.from(text.split(/(\n)/))),
                    rxOps.filter(part => part.length !== 0),
                    rxOps.map(part => [part]),
                    rxOps.scan((acc, parts) => acc[acc.length - 1] === '\n' ? parts : [...acc, ...parts], ['\n']),
                    rxOps.filter(parts => parts[parts.length - 1] === '\n'),
                    rxOps.map(lineParts => lineParts.join(''))
                )

        const stdout = observableAnyToLines(rx.fromEvent(this.instance.stdout, 'data'))
            .pipe(rxOps.map(value => ({ source: 'stdout', value })))
        const stderr = observableAnyToLines(rx.fromEvent(this.instance.stderr, 'data'))
            .pipe(rxOps.map(value => ({ source: 'stderr', value })))
        this.stdStreamsGenerator = observableGenerator(
            rx.never().pipe(rxOps.merge(stdout), rxOps.merge(stderr)),
            next => next.source === 'stderr' || !next.value.startsWith('[')
        )
        await this.getNextResults()
    }

    /**
     * Tries to return the next results from stdout, otherwise stops call stop and throws an exception.
     */
    private async getNextResults() {
        const next = await this.stdStreamsGenerator.next()
        if (next.value.source === 'stderr') {
            this.stop()
            throw new Error(next.value.value)
        }
        if (!next.value.value.startsWith('[')) {
            this.stop()
            throw new Error(`non json array result: ${next.value.value}`)
        }
        try {
            return JSON.parse(next.value.value) as Result[]
        } catch (error) {
            this.stop()
            throw error
        }
    }

    getState() {
        return this.state
    }

    async start() {
        this.requireState('created')

        await this.spawn()
        this.stdin.write('start\n')
        const results = await this.getNextResults()
        this.state = 'started'
        if (isErrorResult(results[results.length - 1])) this.stop()
        return results
    }

    stop() {
        this.requireState('started', 'created')

        try {
            this.stdin.write(`stop\n`)
            if (this.instance.killed) this.instance.kill()
        }
        catch (error) { /* ignored */ }
        this.state = 'stopped'
        this.instance = this.stdin = this.stdStreamsGenerator = null
    }

    input(input: string) {
        this.requireState('started')

        this.stdin.write(`input ${input}\n`)
    }

    async step() {
        this.requireState('started')

        this.stdin.write('step\n')
        const results = await this.getNextResults()
        if (isLastResult(results[results.length - 1]) || isErrorResult(results[results.length - 1])) this.stop()
        return results
    }
}

/**
 * Creates an async generator for the received observable results.
 */
async function* observableGenerator<T>(observable: rx.Observable<T>, stopPredicate: (element: T) => boolean)
    : AsyncIterableIterator<T> {
    while (true) {
        const next = await new Promise(resolve => {
            const subscription = observable.subscribe(value => {
                subscription.unsubscribe()
                resolve(value)
            })
        }) as T
        if (!next || stopPredicate(next)) return next
        yield next
    }
}
