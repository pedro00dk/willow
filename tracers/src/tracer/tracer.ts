import { Result, Event } from '../result'


/**
 * Interface for tracer objects.
 */
export interface Tracer {

    /**
     * Returns the current state of the tracer
     */
    getState(): 'created' | 'started' | 'stopped'

    /**
     * Starts the tracer process.
     */
    start(): Promise<Array<Result>>

    /**
     * Forces the tracer to stop.
     */
    stop(): void

    /**
     * Sends text as input to the traced code.
     */
    input(data: string): void

    /**
     * Steps into the traced code.
     */
    step(): Promise<Array<Result>>

    /**
     * Steps over the traced code.
     */
    stepOver?(): Promise<Array<Result>>

    /**
     * Steps out the traced code.
     */
    stepOut?(): Promise<Array<Result>>

    /**
     * Steps until next breakpoint or de code ends.
     */
    continue?(): Promise<Array<Result>>

    /**
     * Sets a breakpoint in a line.
     */
    setBreakpoint?(line: number): void

    /**
     * Gets the set of breakpoints.
     */
    getBreakpoints?(): Set<number>
}


/**
 * Implements any missing optional methods from other Tracer implementations using only the required methods.
 */
export class DefaultTracer implements Tracer {
    private internalTracer: Tracer
    private breakpoints: Set<number>
    private lastDataResult: Result

    /**
     * Starts the tracer with the internal tracer to implement methods.
     */
    constructor(internalTracer: Tracer) {
        this.internalTracer = internalTracer
        this.breakpoints = new Set()
    }

    /**
     * Updates the last found data result.
     */
    private updateLastDataResult(results: Array<Result>) {
        let dataResults = results.filter(res => res.name === 'data')
        if (dataResults.length != 0) this.lastDataResult = dataResults[dataResults.length - 1]
    }

    getState() {
        return this.internalTracer.getState()
    }

    start() {
        return this.internalTracer.start()
    }

    stop() {
        return this.internalTracer.stop()
    }

    input(data: string) {
        this.internalTracer.input(data)
    }

    async step() {
        let results = await this.internalTracer.step()
        this.updateLastDataResult(results)
        return results
    }

    async stepOver() {
        let results: Array<Result> = []
        while (true) {
            let stepResults = await this.step()
            results.push(...stepResults)

            if (this.lastDataResult && (this.lastDataResult.value as Event).stack_lines ||
                results[results.length - 1].name === 'locked')
                break
        }
        return results
    }

    async stepOut() {
        let results: Array<Result> = []
        let stackLength = this.lastDataResult
            ? (this.lastDataResult.value as Event).stack_lines.length
            : 1
        while (true) {
            let stepResults = await this.step()
            results.push(...stepResults)
            if (this.lastDataResult && (this.lastDataResult.value as Event).stack_lines.length === stackLength - 1 ||
                results[results.length - 1].name === 'locked')
                break
        }
        return results
    }
    async continue() {
        let results = new Array<Result>()
        let stackLength = this.lastDataResult
            ? (this.lastDataResult.value as Event).stack_lines.length
            : 1
        while (true) {
            let stepResults = await this.step()
            results.push(...stepResults)
            let currentLine = this.lastDataResult ? (this.lastDataResult.value as Event).line : null
            if (this.breakpoints.has(currentLine) || results[results.length - 1].name === 'locked') break
        }
        return results
    }

    setBreakpoint(line: number) {
        if (line < 0) throw 'line should be positive'
        this.breakpoints.add(line)
    }

    getBreakpoints() {
        return new Set(this.breakpoints)
    }
}