import { Event, Result } from '../result'
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
    private updateLastDataResult(results: Result[]) {
        const dataResults = results.filter(result => result.name === 'data')
        if (dataResults.length !== 0) this.lastDataResult = dataResults[dataResults.length - 1]
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
        const results = await this.internalTracer.step()
        this.updateLastDataResult(results)
        return results
    }

    async stepOver() {
        const results: Result[] = []
        while (true) {
            const stepResults = await this.step()
            results.push(...stepResults)

            if (this.getState() === 'stopped' ||
                this.lastDataResult && (this.lastDataResult.value as Event).stackLines ||
                results[results.length - 1].name === 'locked')
                break
        }
        return results
    }

    async stepOut() {
        const results: Result[] = []
        const stackLength = this.lastDataResult
            ? (this.lastDataResult.value as Event).stackLines.length
            : 1
        while (true) {
            const stepResults = await this.step()
            results.push(...stepResults)
            if (this.getState() === 'stopped' ||
                this.lastDataResult && (this.lastDataResult.value as Event).stackLines.length === stackLength - 1 ||
                results[results.length - 1].name === 'locked')
                break
        }
        return results
    }
    async continue() {
        const results: Result[] = []
        const stackLength = this.lastDataResult
            ? (this.lastDataResult.value as Event).stackLines.length
            : 1
        while (true) {
            const stepResults = await this.step()
            results.push(...stepResults)
            const currentLine = this.lastDataResult ? (this.lastDataResult.value as Event).line : null
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
        if (line < 0) throw new Error('line should be positive')
        this.breakpoints.add(line)
    }
}
