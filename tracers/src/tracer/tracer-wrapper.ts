import * as log from 'npmlog'
import * as protocol from '../protobuf/protocol'
import { applyResponseProcessorStack, ResponseProcessor, Tracer } from './tracer'

/**
 * Implements any missing optional methods from other Tracer implementations using only the required methods.
 */
export class TracerWrapper implements Tracer {
    private processors: ResponseProcessor[] = []
    private breakpoints: ReadonlySet<number> = new Set()
    private previousInspectedEvent: protocol.Event.Inspected

    constructor(private internalTracer: Tracer) {
        if (!internalTracer) throw new Error('undefined internal tracer')
    }

    private updatePreviousInspectedEvent(response: protocol.TracerResponse) {
        const inspectedEvents = response.events.filter(event => event.inspected != undefined)
        if (inspectedEvents.length !== 0)
            this.previousInspectedEvent = inspectedEvents[inspectedEvents.length - 1].inspected
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
        const results = await applyResponseProcessorStack(this.processors, () => this.internalTracer.step())
        this.updatePreviousInspectedEvent(results)
        return results
    }

    async stepOver() {
        log.info(TracerWrapper.name, 'step over')
        const responses = protocol.TracerResponses.create({ responses: [] })
        const stackLength = this.previousInspectedEvent ? this.previousInspectedEvent.frame.stack.scopes.length : 1
        while (true) {
            const nextResponse = await this.step()
            responses.responses.push(nextResponse)
            if (
                this.getState() === 'stopped' ||
                (this.previousInspectedEvent && this.previousInspectedEvent.frame.stack.scopes.length <= stackLength) ||
                nextResponse.events[nextResponse.events.length - 1].locked != undefined
            )
                break
        }
        return responses
    }

    async stepOut() {
        log.info(TracerWrapper.name, 'step out')
        const responses = protocol.TracerResponses.create({ responses: [] })
        const stackLength = this.previousInspectedEvent ? this.previousInspectedEvent.frame.stack.scopes.length : 1
        while (true) {
            const nextResponse = await this.step()
            responses.responses.push(nextResponse)
            if (
                this.getState() === 'stopped' ||
                (this.previousInspectedEvent && this.previousInspectedEvent.frame.stack.scopes.length < stackLength) ||
                nextResponse.events[nextResponse.events.length - 1].locked != undefined
            )
                break
        }
        return responses
    }

    async continue() {
        log.info(TracerWrapper.name, 'continue')
        const responses = protocol.TracerResponses.create({ responses: [] })
        while (true) {
            const nextResponse = await this.step()
            responses.responses.push(nextResponse)
            const currentLine = this.previousInspectedEvent ? this.previousInspectedEvent.frame.line : undefined
            if (
                this.getState() === 'stopped' ||
                this.breakpoints.has(currentLine) ||
                nextResponse.events[nextResponse.events.length - 1].locked != undefined
            )
                break
        }
        return responses
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

    addStepProcessor(stepProcessor: ResponseProcessor) {
        log.info(TracerWrapper.name, 'add step processor', { stepProcessor })
        if (!stepProcessor) throw new Error('undefined step processor')
        this.processors.push(stepProcessor)
    }
}
