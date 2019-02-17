import * as log from 'npmlog'
import * as rx from 'rxjs'
import * as rxOps from 'rxjs/operators'
import { ObservableProcess, StreamLine } from '../process/observable-process'
import { isErrorResult, isLastResult, Result } from '../result'
import { Tracer } from './tracer'


/**
 * Connects to a tracer process.
 */
export class TracerProcess implements Tracer {
    private process: ObservableProcess
    private results: rx.Observable<Result[]>
    private state: 'created' | 'started' | 'stopped'

    /**
     * Initializes the client with the command to spawn the process.
     */
    constructor(command: string) {
        this.process = new ObservableProcess(command)
        this.state = 'created'
    }

    /**
     * Throws an exception if the tracer state is not in the expected states list.
     */
    private requireState(...states: typeof TracerProcess.prototype.state[]) {
        if (!states.includes(this.state)) {
            const error = `unexpected tracer state: ${this.state}, expected one of: ${states}`
            log.warn(TracerProcess.name, error)
            throw new Error(error)
        }
    }

    /**
     * Spawns the tracer process and configures the observables to transform the input and check for errors.
     */
    private async spawn() {
        log.info(TracerProcess.name, 'spawn')
        this.process.spawn()
        this.results = this.process.stdMux
            .pipe(
                rxOps.map(streamLine => {
                    if (streamLine.source === 'stderr') {
                        const error = `process stderr: ${streamLine.line}`
                        log.error(TracerProcess.name, error)
                        throw new Error(error)
                    }
                    if (!streamLine.line.startsWith('[')) {
                        const error = `process stdout: ${streamLine.line}`
                        log.error(TracerProcess.name, error)
                        throw new Error(error)
                    }
                    try {
                        return JSON.parse(streamLine.line) as Result[]
                    } catch (error) {
                        const error_ = `process stdout: ${error.message}`
                        log.error(TracerProcess.name, error_)
                        throw new SyntaxError(error_)
                    }
                })
            )
        this.results
            .pipe(
                rxOps.flatMap(results => rx.from(results)),
                rxOps.filter(result => isErrorResult(result) || isLastResult(result)),
                rxOps.take(1)
            )
            .subscribe(
                value => {
                    log.info(TracerProcess.name, 'received error or last result')
                    this.stop()
                },
                error => {
                    log.info(TracerProcess.name, 'received error or last result')
                    this.stop()
                }
            )
        await this.results.pipe(rxOps.take(1)).toPromise()
    }

    getState() {
        return this.state
    }

    async start() {
        log.info(TracerProcess.name, 'start')
        this.requireState('created')
        this.state = 'started'
        await this.spawn()
        this.process.stdin.next('start')
        const results = await this.results.pipe(rxOps.take(1)).toPromise()
        return results
    }

    stop() {
        log.info(TracerProcess.name, 'stop')
        this.requireState('started', 'created')
        this.state = 'stopped'
        try {
            this.process.stdin.next('stop')
            this.process.stdin.complete()
        } catch (error) { /* ignore */ }
    }

    input(input: string) {
        log.verbose(TracerProcess.name, 'input', { input })
        this.requireState('started')
        this.process.stdin.next(`input ${input}`)
    }

    async step() {
        log.verbose(TracerProcess.name, 'step')
        this.requireState('started')
        this.process.stdin.next('step')
        const results = await this.results.pipe(rxOps.take(1)).toPromise()
        return results
    }
}
