import * as cp from 'child_process'
import * as rx from 'rxjs'
import * as rxOps from 'rxjs/operators'
import { Writable } from 'stream'


/**
 * Connects to a tracer process.
 */
export class TracerClient {
    private command: string

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

        rx.fromEvent(instance.stdout, 'data')
            .pipe(
                rxOps.map(obj => obj as Buffer),
                rxOps.map(buf => buf.toString('utf8'))
            )
            .subscribe(str => console.log(str))

        rx.fromEvent(instance.stderr, 'data')
            .pipe(
                rxOps.map(obj => obj as Buffer),
                rxOps.map(buf => buf.toString('utf8'))
            )
            .subscribe(str => console.error(str))

        instance.stdin.write('start\n')
        setInterval(() => instance.stdin.write('step\n'), 1000)
    }
}