import * as log from 'npmlog'
import { Event, Result } from '../types/tracers'
import { applyStepPreprocessorStack, StepProcessor, Tracer } from './tracer'


/**
 * Implements any missing optional methods from other Tracer implementations using only the required methods.
 */
export class TracerWrapper implements Tracer {
    private internalTracer: Tracer
    private processors: StepProcessor[]
    private breakpoints: Set<number>
    private lastDataResult: Result

    /**
     * Starts the tracer with the internal tracer to implement methods.
     */
    constructor(internalTracer: Tracer) {
        if (!internalTracer) {
            const error = 'internal tracer not provided'
            log.error(TracerWrapper.name, error)
            throw new Error(error)
        }
        this.internalTracer = internalTracer
        this.processors = []
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
        log.info(TracerWrapper.name, 'start')
        return this.internalTracer.start()
    }

    stop() {
        log.info(TracerWrapper.name, 'stop')
        return this.internalTracer.stop()
    }

    input(data: string) {
        log.verbose(TracerWrapper.name, 'input', { data })
        this.internalTracer.input(data)
    }

    async step() {
        log.verbose(TracerWrapper.name, 'step')
        const results = await applyStepPreprocessorStack(this.processors, () => this.internalTracer.step())
        this.updateLastDataResult(results)
        return results
    }

    async stepOver() {
        log.info(TracerWrapper.name, 'step over')
        const results: Result[] = []
        const stackLength = this.lastDataResult ? (this.lastDataResult.value as Event).stackLines.length : 1
        while (true) {
            const stepResults = await this.step()
            results.push(...stepResults)
            if (this.getState() === 'stopped' ||
                this.lastDataResult && (this.lastDataResult.value as Event).stackLines.length <= stackLength ||
                results[results.length - 1].name === 'locked')
                break
        }
        return results
    }

    async stepOut() {
        log.info(TracerWrapper.name, 'step out')
        const results: Result[] = []
        const stackLength = this.lastDataResult ? (this.lastDataResult.value as Event).stackLines.length : 1
        while (true) {
            const stepResults = await this.step()
            results.push(...stepResults)
            if (this.getState() === 'stopped' ||
                this.lastDataResult && (this.lastDataResult.value as Event).stackLines.length < stackLength ||
                results[results.length - 1].name === 'locked')
                break
        }
        return results
    }

    async continue() {
        log.info(TracerWrapper.name, 'continue')
        const results: Result[] = []
        while (true) {
            const stepResults = await this.step()
            results.push(...stepResults)
            const currentLine = this.lastDataResult ? (this.lastDataResult.value as Event).line : undefined
            if (this.getState() === 'stopped' || this.breakpoints.has(currentLine) ||
                results[results.length - 1].name === 'locked')
                break
        }
        return results
    }

    getBreakpoints() {
        log.info(TracerWrapper.name, 'get breakpoints')
        return [...this.breakpoints]
    }

    setBreakpoints(lines: number[]) {
        log.info(TracerWrapper.name, 'set breakpoints', { lines })
        this.breakpoints = new Set(lines)
    }

    addStepProcessor(processor: StepProcessor) {
        if (!processor) {
            const error = 'step processor not provided'
            log.error(TracerWrapper.name, error)
            throw new Error(error)
        }
        log.info(TracerWrapper.name, 'add step processor')
        this.processors.push(processor)
    }
}
