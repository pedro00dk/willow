import * as cp from 'child_process'
import * as rx from 'rxjs'
import * as rxOps from 'rxjs/operators'
import { Writable } from 'stream'
import { promisify } from 'util'


/**
 * Processes output streams.
 */
export type ProcessStream = 'stderr' | 'stdout'

/**
 * Process responses type.
 */
export type ProcessResponse = { source: ProcessStream, value: string }

/**
 * Creates and connects to a process providing easy access to multiplexed formatted streams.
 */
export class MultiplexProcess {
    private command: string
    private instance: cp.ChildProcess
    private stdin: Writable
    private stdMux: AsyncIterableIterator<ProcessResponse>

    /**
     * Initializes the process with the spawn command.
     */
    constructor(command: string) {
        this.command = command
    }

    /**
     * Returns true if the process is running.
     */
    isRunning() {
        return this.instance != null && !this.instance.killed
    }

    /**
     * Spawns the process.
     */
    spawn() {
        if (this.isRunning()) throw new Error("process is running")

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

        const stderr = observableAnyToLines(rx.fromEvent(this.instance.stderr, 'data'))
            .pipe(rxOps.map(value => ({ source: 'stderr' as ProcessStream, value })))
        const stdout = observableAnyToLines(rx.fromEvent(this.instance.stdout, 'data'))
            .pipe(rxOps.map(value => ({ source: 'stdout' as ProcessStream, value })))
        this.stdMux = observableGenerator(rx.never().pipe(rxOps.merge(stdout), rxOps.merge(stderr)))
    }

    /**
     * Sends a string through process stdin, automatically appends a line break.
     */
    write(message: string) {
        if (!this.isRunning()) throw new Error("process not running")

        this.stdin.write(`${message}\n`)
    }

    /**
     * Reads the next available line in the stderr or stdout.
     */
    async read() {
        if (!this.isRunning()) throw new Error("process not running")

        return (await this.stdMux.next()).value
    }

    /**
     * Sends a message and returns the received response from the process.
     */
    question(message: string) {
        const answer = this.read()
        this.write(message)
        return answer
    }

    /**
     * Kills the process.
     */
    kill(force?: boolean) {
        if (!this.isRunning()) throw new Error("process not running")

        this.instance.kill(force ? 'SIGKILL' : undefined)
    }
}

/**
 * Creates an async generator for the received observable results.
 */
async function* observableGenerator<T>(observable: rx.Observable<T>)
    : AsyncIterableIterator<T> {
    let complete = false
    observable.subscribe(null, null, () => complete = true)
    while (!complete) yield await observable.pipe(rxOps.take(1)).toPromise() as T
}
