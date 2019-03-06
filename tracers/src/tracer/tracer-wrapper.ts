import * as log from 'npmlog'
import * as protocol from '../protobuf/protocol'
import { applyStepProcessorStack, StepProcessor, Tracer } from './tracer'


/**
 * Implements any missing optional methods from other Tracer implementations using only the required methods.
 */
export class TracerWrapper implements Tracer {
    private processors: StepProcessor[] = []
    private breakpoints: ReadonlySet<number> = new Set()
    private previousInspectedEvent: protocol.Event.Inspected

    constructor(private internalTracer: Tracer) {
        if (!internalTracer) throw new Error('undefined internal tracer')
    }

    private updatePreviousInspectedEvent(events: protocol.Event[]) {
        const inspectedEvents = events.filter(event => event.inspected != undefined)
        if (inspectedEvents.length !== 0) this.previousInspectedEvent = inspectedEvents[inspectedEvents.length - 1]
    }

    getState() {
        return this.internalTracer.getState()
    }

    start(main: string, code: string) {
        log.info(TracerWrapper.name, 'start')
        return this.internalTracer.start(main, code)
    }

    stop() {
        log.info(TracerWrapper.name, 'stop')
        return this.internalTracer.stop()
    }

    async step() {
        log.verbose(TracerWrapper.name, 'step')
        const results = await applyStepProcessorStack(this.processors, () => this.internalTracer.step())
        this.updatePreviousInspectedEvent(results)
        return results
    }

    async stepOver() {
        log.info(TracerWrapper.name, 'step over')
        const results: protocol.Event[] = []
        const stackLength = this.previousInspectedEvent ? this.previousInspectedEvent.frame.stack.scopes.length : 1
        while (true) {
            results.push(...await this.step())
            if (this.getState() === 'stopped' ||
                this.previousInspectedEvent && this.previousInspectedEvent.frame.stack.scopes.length <= stackLength ||
                results[results.length - 1].locked != undefined)
                break
        }
        return results
    }

    async stepOut() {
        log.info(TracerWrapper.name, 'step out')
        const results: protocol.Event[] = []
        const stackLength = this.previousInspectedEvent ? this.previousInspectedEvent.frame.stack.scopes.length : 1
        while (true) {
            results.push(...await this.step())
            if (this.getState() === 'stopped' ||
                this.previousInspectedEvent && this.previousInspectedEvent.frame.stack.scopes.length < stackLength ||
                results[results.length - 1].locked != undefined)
                break
        }
        return results
    }

    async continue() {
        log.info(TracerWrapper.name, 'continue')
        const results: protocol.Event[] = []
        while (true) {
            const stepResults = await this.step()
            results.push(...stepResults)
            const currentLine = this.previousInspectedEvent ? this.previousInspectedEvent.frame.line : undefined
            if (this.getState() === 'stopped' || this.breakpoints.has(currentLine) ||
                results[results.length - 1].locked != undefined)
                break
        }
        return results
    }

    input(lines: string[]) {
        log.verbose(TracerWrapper.name, 'input')
        return this.internalTracer.input(lines)
    }

    getBreakpoints() {
        log.info(TracerWrapper.name, 'get breakpoints')
        return this.breakpoints
    }

    setBreakpoints(breakpoints: ReadonlySet<number>) {
        log.info(TracerWrapper.name, 'set breakpoints', { breakpoints: [...breakpoints] })
        this.breakpoints = breakpoints
    }

    addStepProcessor(stepProcessor: StepProcessor) {
        log.info(TracerWrapper.name, 'add step processor', {stepProcessor})
        if (!stepProcessor) throw new Error('undefined step processor')
        this.processors.push(stepProcessor)
    }
}
