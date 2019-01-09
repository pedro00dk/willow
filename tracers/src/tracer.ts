import * as cp from 'child_process'
import * as rx from 'rxjs'
import * as rxOps from 'rxjs/operators'

import { Result } from './result'


/**
 * Connects to a tracer process.
 */
export class TracerClient {
    private command: string
    private instance: cp.ChildProcess
    private stdout: rx.Observable<Result>
    private stderr: rx.Observable<string>

    /**
     * Initializes the client with the command to spawn the process.
     */
    constructor(command: string) {
        this.command = command
    }

    /**
     * Throws an exception if the tracer instance is not spawned.
     */
    public requireSpawned() {
        if (!this.instance || this.instance.killed) throw 'tracer not spawned'
    }

    /**
    * Spawns the tracer server process.
    */
    spawn() {
        this.instance = cp.spawn(this.command, { shell: true })

        this.stdout = observableAnyToLines(rx.fromEvent(this.instance.stdout, 'data'))
            .pipe(
                rxOps.filter(str => str.startsWith('{')),
                rxOps.map(str => JSON.parse(str) as Result)
            )
        this.stderr = observableAnyToLines(rx.fromEvent(this.instance.stderr, 'data'))
    }

    async start() {
        this.requireSpawned()
        let resultPromise = observableNextAsPromise(this.stdout)
        this.instance.stdin.write('start\n')
        console.log(await resultPromise)
    }

    async step() {
        this.requireSpawned()
        let resultPromise = observableNextAsPromise(this.stdout)
        this.instance.stdin.write('step\n')
        console.log(await resultPromise)
    }

    input(input: string) {
        this.requireSpawned()
        this.instance.stdin.write(`input ${input}\n`)
    }

    stop() {
        this.requireSpawned()
        this.instance.stdin.write(`stop\n`)
        this.instance = this.stdout = this.stderr = null
    }
}

/**
 * Pipes an rx.Observable<any> containing text split in any form to string lines obtained from the buffers. 
 */
function observableAnyToLines(observable: rx.Observable<Buffer>): rx.Observable<string> {
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
 * Returns a promise to consume the next observable element.
 */
function observableNextAsPromise<T>(observable: rx.Observable<T>) {
    return new Promise(
        res => {
            let subscription = observable.subscribe(
                val => {
                    res(val)
                    subscription.unsubscribe()
                }
            )
        }
    )
}