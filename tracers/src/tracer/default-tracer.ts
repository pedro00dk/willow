import { Result, Event } from '../result'
import { Tracer } from './tracer'


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
        let dataResults = results.filter(result => result.name === 'data')
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

            if (this.getState() === 'stopped' ||
                this.lastDataResult && (this.lastDataResult.value as Event).stackLines ||
                results[results.length - 1].name === 'locked')
                break
        }
        return results
    }

    async stepOut() {
        let results: Array<Result> = []
        let stackLength = this.lastDataResult
            ? (this.lastDataResult.value as Event).stackLines.length
            : 1
        while (true) {
            let stepResults = await this.step()
            results.push(...stepResults)
            if (this.getState() === 'stopped' ||
                this.lastDataResult && (this.lastDataResult.value as Event).stackLines.length === stackLength - 1 ||
                results[results.length - 1].name === 'locked')
                break
        }
        return results
    }
    async continue() {
        let results = new Array<Result>()
        let stackLength = this.lastDataResult
            ? (this.lastDataResult.value as Event).stackLines.length
            : 1
        while (true) {
            let stepResults = await this.step()
            results.push(...stepResults)
            let currentLine = this.lastDataResult ? (this.lastDataResult.value as Event).line : null
            if (this.getState() === 'stopped' || this.breakpoints.has(currentLine) ||
                results[results.length - 1].name === 'locked')
                break
        }
        return results
    }

    getBreakpoints() {
        return new Set(this.breakpoints)
    }

    setBreakpoint(line: number) {
        if (line < 0) throw 'line should be positive'
        this.breakpoints.add(line)
    }
}