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
        const inspectedEvents = response.events.filter(event => !!event.inspected)
        if (inspectedEvents.length !== 0)
            this.previousInspectedEvent = inspectedEvents[inspectedEvents.length - 1].inspected
    }

    getState() {
        return this.internalTracer.getState()
    }

    start(start: protocol.Action.Start) {
        log.info(TracerWrapper.name, 'start')
        return this.internalTracer.start(start)
    }

    stop() {
        log.info(TracerWrapper.name, 'stop')
        return this.internalTracer.stop()
    }

    async step(count: number = 1) {
        log.verbose(TracerWrapper.name, 'step')
        try {
            const results = await applyResponseProcessorStack(this.processors, () => this.internalTracer.step(count))
            this.updatePreviousInspectedEvent(results)
            return results
        } catch (error) {
            if (this.getState() === 'started') this.stop()
            throw error
        }
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
                !!nextResponse.events[nextResponse.events.length - 1].locked
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
                !!nextResponse.events[nextResponse.events.length - 1].locked
            )
                break
        }
        return responses
    }

    async continue(ignoreBreakpoints: boolean = false, stepCount: number = 1) {
        log.info(TracerWrapper.name, 'continue')
        const responses = protocol.TracerResponses.create({ responses: [] })
        while (true) {
            const nextResponse = await this.step(!ignoreBreakpoints ? 1 : stepCount)
            responses.responses.push(nextResponse)
            const currentLine = this.previousInspectedEvent ? this.previousInspectedEvent.frame.line : undefined
            if (
                this.getState() === 'stopped' ||
                (!ignoreBreakpoints && this.breakpoints.has(currentLine)) ||
                !!nextResponse.events[nextResponse.events.length - 1].locked
            )
                break
        }
        return responses
    }

    input(input: protocol.Action.Input) {
        log.verbose(TracerWrapper.name, 'input')
        return this.internalTracer.input(input)
    }

    getBreakpoints() {
        log.info(TracerWrapper.name, 'get breakpoints')
        return protocol.Breakpoints.create({ lines: [...this.breakpoints] })
    }

    setBreakpoints(breakpoints: protocol.Breakpoints) {
        log.info(TracerWrapper.name, 'set breakpoints', { breakpoints: [...breakpoints.lines] })
        this.breakpoints = new Set(breakpoints.lines)
    }

    addStepProcessor(stepProcessor: ResponseProcessor) {
        log.info(TracerWrapper.name, 'add step processor', { stepProcessor })
        if (!stepProcessor) throw new Error('undefined step processor')
        this.processors.push(stepProcessor)
    }
}
