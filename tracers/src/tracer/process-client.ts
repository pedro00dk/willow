import * as cp from 'child_process'
import * as rx from 'rxjs'
import * as rxOps from 'rxjs/operators'

import { Result, Event } from '../result'
import { Writable } from 'stream';


/**
 * Connects to a tracer process.
 */
export class ProcessClient {
    private command: string
    private state: 'created' | 'spawned' | 'started' | 'stopped'
    private stdin: Writable
    private stdout: AsyncIterableIterator<Array<Result>>
    private stderr: AsyncIterableIterator<string>

    static isLastResult: (res: Result) => boolean = res => res.name === 'data' && (res.value as Event).finish

    /**
     * Initializes the client with the command to spawn the process.
     */
    constructor(command: string) {
        this.command = command
        this.state = 'created'
    }

    /**
     * Throws an exception if the tracer state is not expected.
     */
    public requireState(state: typeof ProcessClient.prototype.state) {
        if (this.state !== state) throw `unexpected tracer state: ${this.state}, expected: ${state}`
    }

    /**
    * Spawns the tracer server process.
    */
    spawn() {
        this.requireState('created')

        let instance = cp.spawn(this.command, { shell: true })
        this.stdin = instance.stdin
        this.stdout = observableGenerator(
            observableAnyToLines(rx.fromEvent(instance.stdout, 'data'))
                .pipe(
                    rxOps.filter(str => str.startsWith('[')),
                    rxOps.map(str => JSON.parse(str) as Array<Result>),
                ),
            next => ProcessClient.isLastResult(next[next.length - 1])
        )
        this.stderr = observableGenerator(
            observableAnyToLines(rx.fromEvent(instance.stderr, 'data')),
            next => false
        )

        this.state = 'spawned'
    }

    async start() {
        this.requireState('spawned')

        this.stdin.write('start\n')
        let results = (await this.stdout.next()).value

        this.state = 'started'
        return results
    }

    async step() {
        this.requireState('started')

        this.stdin.write('step\n')
        let results = (await this.stdout.next()).value

        if (ProcessClient.isLastResult(results[results.length - 1]))
            this.stop()

        return results
    }

    input(input: string) {
        this.requireState('started')

        this.stdin.write(`input ${input}\n`)
    }

    stop() {
        this.requireState('started')

        try {
            this.stdin.write(`stop\n`)
        } catch (error) { }
        this.stdin = this.stdout = this.stderr = null

        this.state = 'stopped'
    }
}

/**
 * Pipes an rx.Observable<any> containing text split in any form to string lines obtained from the buffers. 
 */
function observableAnyToLines(observable: rx.Observable<any>): rx.Observable<string> {
    return observable
        .pipe(
            rxOps.map(obj => obj as Buffer),
            rxOps.map(buf => buf.toString('utf8')),
            rxOps.flatMap(str => rx.from(str.split(/(\n)/))),
            rxOps.filter(str => str.length !== 0),
            rxOps.map(str => [str]),
            rxOps.scan((acc, val) => acc[acc.length - 1] === '\n' ? val : [...acc, ...val], ['\n']),
            rxOps.filter(arr => arr[arr.length - 1] === '\n'),
            rxOps.map(arr => arr.join('')),
        )
}

/**
 * Creates an async generator for the received observable results.
 */
async function* observableGenerator<T>(observable: rx.Observable<T>, stopPredicate: (element: T) => boolean): AsyncIterableIterator<T> {
    while (true) {
        let next = await new Promise(res => {
            let subscription = observable.subscribe(val => {
                subscription.unsubscribe()
                res(val)
            })
        }) as T
        if (!next || stopPredicate(next)) return next
        yield next
    }
}