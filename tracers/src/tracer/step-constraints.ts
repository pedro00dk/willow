import * as log from 'npmlog'
import { Event, HeapObjectType, queryReferenceTypes, queryValueTypes, Result } from '../result'
import { StepProcessor } from './tracer'


/**
 * Stores and check results memory constraints.
 */
export class StepConstraints implements StepProcessor {
    private steps: number
    private stackSize: number
    private heapSize: number
    private stringLength: number
    private iterableLength: number
    private objectProperties: number
    private currentStep: number

    /**
     * Creates the processor with the constraints values.
     */
    constructor(
        steps: number, stackSize: number, heapSize: number, stringLength: number, iterableLength: number,
        objectProperties: number
    ) {
        if (steps < 1) {
            const error = 'steps smaller than 1'
            log.error(StepConstraints.name, error, { steps })
            throw new Error(error)
        }
        if (stackSize < 1) {
            const error = 'stackSize smaller than 1'
            log.error(StepConstraints.name, error, { stackSize })
            throw new Error(error)
        }
        if (heapSize < 1) {
            const error = 'heapSize smaller than 1'
            log.error(StepConstraints.name, error, { heapSize })
            throw new Error(error)
        }
        if (stringLength < 1) {
            const error = 'stringLength smaller than 1'
            log.error(StepConstraints.name, error, { stringLength })
            throw new Error(error)
        }
        if (iterableLength < 1) {
            const error = 'iterableLength smaller than 1'
            log.error(StepConstraints.name, error, { iterableLength })
            throw new Error(error)
        }
        if (objectProperties < 1) {
            const error = 'objectProperties smaller than 1'
            log.error(StepConstraints.name, error, { objectProperties })
            throw new Error(error)
        }
        this.steps = steps
        this.stackSize = stackSize
        this.heapSize = heapSize
        this.stringLength = stringLength
        this.iterableLength = iterableLength
        this.objectProperties = objectProperties
        this.currentStep = 0
    }

    /**
     * Checks all constraints in the received result.
     */
    private check(result: Result) {
        if (result.name !== 'data') return
        const event = result.value as Event
        this.currentStep++
        if (this.currentStep > this.steps) {
            const error = `tracer constraint: max steps exceeded ${this.steps}`
            log.warn(StepConstraints.name, error)
            throw new Error(error)
        }
        if (event.stackLines.length > this.stackSize) {
            const error = `tracer constraint: max stack size exceeded ${this.stackSize}`
            log.warn(StepConstraints.name, error)
            throw new Error(error)
        }
        if (Object.keys(event.heapGraph).length > this.heapSize) {
            const error = `tracer constraint: max heap size exceeded ${this.heapSize}`
            log.warn(StepConstraints.name, error)
            throw new Error(error)
        }
        for (const value of queryValueTypes(event, 'string')) {
            const stringValue = value as string
            if ((stringValue.startsWith('\'') || stringValue.startsWith('"')) &&
                stringValue.length > this.stringLength + 2) {
                const error = `tracer constraint: max string length exceeded ${this.stringLength}`
                log.warn(StepConstraints.name, error)
                throw new Error(error)
            }
        }
        for (const value of queryReferenceTypes(event, 'list', 'map', 'set'))
            if ((value as HeapObjectType).members.length > this.iterableLength) {
                const error = `tracer constraint: max iterable length exceeded ${this.iterableLength}`
                log.warn(StepConstraints.name, error)
                throw new Error(error)
            }
        for (const value of queryReferenceTypes(event, 'udo'))
            if ((value as HeapObjectType).members.length > this.objectProperties) {
                const error = `tracer constraint: max object properties exceeded ${this.objectProperties}`
                log.warn(StepConstraints.name, error, {})
                throw new Error(error)
            }
    }

    async consume(step: () => Promise<Result[]>) {
        const results = await step()
        results.forEach(result => this.check(result))
        return results
    }
}
