import * as cp from 'child_process'
import * as log from 'npmlog'
import * as rx from 'rxjs'
import * as rxOps from 'rxjs/operators'


/**
 * Process stream line.
 */
export type StreamLine = { source: 'stdout' | 'stderr', line: string }

/**
 * Creates and connects to a process providing easy access to multiplexed formatted streams.
 */
export class ObservableProcess<T extends string = string> {
    private command: string
    private instance: cp.ChildProcess
    private stdin_: rx.Subject<T>
    private stdout_: rx.Observable<string>
    private stderr_: rx.Observable<string>
    private stdMux_: rx.Observable<StreamLine>

    get stdin() { return this.stdin_ }
    get stdout() { return this.stdout_ }
    get stderr() { return this.stderr_ }
    get stdMux() { return this.stdMux_ }

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
        return this.instance && !this.instance.killed
    }

    /**
     * Spawns the process and initializes the streams.
     */
    spawn() {
        log.info(ObservableProcess.name, 'spawn')
        if (this.isRunning()) {
            const error = 'process is running'
            log.error(ObservableProcess.name, error)
            throw new Error(error)
        }
        this.instance = cp.spawn(this.command, { shell: '/bin/bash' })
        log.info(ObservableProcess.name, 'process started')
        const stopObservable = rx.merge(rx.fromEvent(this.instance, 'error'), rx.fromEvent(this.instance, 'exit'))
            .pipe(rxOps.take(1))
        stopObservable.subscribe(next => log.info(ObservableProcess.name, 'process stopped'))
        this.stdin_ = new rx.Subject()
        this.stdin_
            .pipe(rxOps.map(input => `${input}\n`))
            .subscribe(
                next => this.instance.stdin.write(next),
                error => { if (!this.instance.killed) this.instance.kill() },
                () => { if (!this.instance.killed) this.instance.kill() }
            )
        stopObservable.subscribe(next => this.stdin.complete())

        const unknownObservableToLines = (observable: rx.Observable<unknown>) =>
            observable
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

        this.stdout_ = unknownObservableToLines(rx.fromEvent(this.instance.stdout, 'data'))
            .pipe(rxOps.takeUntil(stopObservable))
        this.stderr_ = unknownObservableToLines(rx.fromEvent(this.instance.stderr, 'data'))
            .pipe(rxOps.takeUntil(stopObservable))
        this.stdMux_ = rx.merge(
            this.stdout_.pipe(rxOps.map(line => ({ source: 'stdout', line } as StreamLine))),
            this.stderr_.pipe(rxOps.map(line => ({ source: 'stderr', line } as StreamLine)))
        )
    }
}
