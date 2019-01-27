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
        if (steps < 1) throw new Error('steps smaller than 1')
        if (stackSize < 1) throw new Error('stackSize smaller than 1')
        if (heapSize < 1) throw new Error('heapSize smaller than 1')
        if (stringLength < 1) throw new Error('stringLength smaller than 1')
        if (iterableLength < 1) throw new Error('iterableLength smaller than 1')
        if (objectProperties < 1) throw new Error('objectProperties smaller than 1')
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

        if (this.currentStep > this.steps)
            throw new Error(`tracer constraint: max steps exceeded ${this.steps}`)

        if (event.stackLines.length > this.stackSize)
            throw new Error(`tracer constraint: max stack size exceeded ${this.stackSize}`)

        if (Object.keys(event.heapGraph).length > this.heapSize)
            throw new Error(`tracer constraint: max heap size exceeded ${this.heapSize}`)

        for (const value of queryValueTypes(event, 'string')) {
            const stringValue = value as string
            if ((stringValue.startsWith('\'') || stringValue.startsWith('"')) &&
                stringValue.length > this.stringLength + 2)
                throw new Error(`tracer constraint: max string length exceeded ${this.stringLength}`)
        }

        for (const value of queryReferenceTypes(event, 'list', 'map', 'set'))
            if ((value as HeapObjectType).members.length > this.iterableLength)
                throw new Error(`tracer constraint: max iterable length exceeded ${this.iterableLength}`)

        for (const value of queryReferenceTypes(event, 'udo'))
            if ((value as HeapObjectType).members.length > this.objectProperties)
                throw new Error(`tracer constraint: max object properties exceeded ${this.objectProperties}`)
    }

    async consume(step: () => Promise<Result[]>) {
        const results = await step()
        results.forEach(result => this.check(result))
        return results
    }
}
