import * as cp from 'child_process'
import * as rx from 'rxjs'
import * as rxOps from 'rxjs/operators'
import { Writable } from 'stream'

import { Result } from './result'


/**
 * Connects to a tracer process.
 */
export class TracerClient {
    private command: string
    private stdout: rx.Observable<Result> | undefined
    private stderr: rx.Observable<string> | undefined

    /**
     * Initializes the client with the command to spawn the process.
     */
    constructor(command: string) {
        this.command = command
    }

    /**
    * Spawns the tracer server process.
    */
    spawn() {
        let instance = cp.spawn(this.command, { shell: true })

        this.stdout = observableAnyToLines(rx.fromEvent(instance.stdout, 'data'))
            .pipe(
                rxOps.filter(str => str.startsWith('{')),
                rxOps.map(str => JSON.parse(str) as Result)
            )
        this.stdout.subscribe(obj => console.log(obj))

        this.stderr = observableAnyToLines(rx.fromEvent(instance.stderr, 'data'))
        this.stderr.subscribe(str => console.error(str))

        instance.stdin.write('start\n')
        setInterval(() => instance.stdin.write('step\n'), 1000)
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