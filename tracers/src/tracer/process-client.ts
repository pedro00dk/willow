import * as cp from 'child_process'
import * as rx from 'rxjs'
import * as rxOps from 'rxjs/operators'
import { Writable } from 'stream'

import { Result, Event } from '../result'
import { Tracer } from './tracer'


/**
 * Connects to a tracer process.
 */
export class ProcessClient implements Tracer {
    private command: string
    private state: 'created' | 'started' | 'stopped'
    private stdin: Writable
    private stdout: AsyncIterableIterator<Array<Result>>
    private stderr: rx.Observable<string>


    /**
     * Initializes the client with the command to spawn the process.
     */
    constructor(command: string) {
        this.command = command
        this.state = 'created'
        this.spawn()
    }

    /**
     * Throws an exception if the tracer state is not in the expected states list.
     */
    private requireState(...states: Array<typeof ProcessClient.prototype.state>) {
        if (!states.includes(this.state)) throw `unexpected tracer state: ${this.state}, expected one of: ${states}`
    }

    /**
     * Returns true if a result is the last.
     */
    private isLastResult(res: Result) {
        return res.name === 'data' && (res.value as Event).finish
    }

    /**
     * Spawns the tracer server process.
     */
    private spawn() {
        let instance = cp.spawn(this.command, { shell: true })
        this.stdin = instance.stdin
        this.stdout = observableGenerator(
            observableAnyToLines(rx.fromEvent(instance.stdout, 'data'))
                .pipe(
                    rxOps.filter(line => line.startsWith('[')),
                    rxOps.map(line => JSON.parse(line) as Array<Result>),
                ),
            next => this.isLastResult(next[next.length - 1])
        )
        this.stderr = observableAnyToLines(rx.fromEvent(instance.stderr, 'data'))
        this.stderr.subscribe(error => console.error(error))
    }

    getState() {
        return this.state
    }

    async start() {
        this.requireState('created')

        this.stdin.write('start\n')
        let results = (await this.stdout.next()).value

        this.state = 'started'
        return results
    }

    stop() {
        this.requireState('started', "created")

        try { this.stdin.write(`stop\n`) }
        catch (error) { }
        this.stdin = this.stdout = this.stderr = null

        this.state = 'stopped'
    }

    input(input: string) {
        this.requireState('started')

        this.stdin.write(`input ${input}\n`)
    }

    async step() {
        this.requireState('started')

        this.stdin.write('step\n')
        let results = (await this.stdout.next()).value

        if (this.isLastResult(results[results.length - 1])) this.stop()

        return results
    }
}

/**
 * Pipes an rx.Observable<any> containing text split in any form to string lines obtained from the buffers. 
 */
function observableAnyToLines(observable: rx.Observable<any>): rx.Observable<string> {
    return observable
        .pipe(
            rxOps.map(object => object as Buffer),
            rxOps.map(buffer => buffer.toString('utf8')),
            rxOps.flatMap(string => rx.from(string.split(/(\n)/))),
            rxOps.filter(part => part.length !== 0),
            rxOps.map(part => [part]),
            rxOps.scan((acc, parts) => acc[acc.length - 1] === '\n' ? parts : [...acc, ...parts], ['\n']),
            rxOps.filter(parts => parts[parts.length - 1] === '\n'),
            rxOps.map(lineParts => lineParts.join('')),
        )
}

/**
 * Creates an async generator for the received observable results.
 */
async function* observableGenerator<T>(observable: rx.Observable<T>, stopPredicate: (element: T) => boolean): AsyncIterableIterator<T> {
    while (true) {
        let next = await new Promise(resolve => {
            let subscription = observable.subscribe(value => {
                subscription.unsubscribe()
                resolve(value)
            })
        }) as T
        if (!next || stopPredicate(next)) return next
        yield next
    }
}