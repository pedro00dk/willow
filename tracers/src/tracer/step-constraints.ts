import * as protocol from '../protobuf/protocol'
import { queryObjectTypes, queryValueTypes, StepProcessor } from './tracer'

/**
 * Checks results memory constraints on event frames.
 */
export class StepConstraints implements StepProcessor {
    private currentStep: number = 0

    constructor(
        private steps: number,
        private stackSize: number,
        private heapSize: number,
        private stringLength: number,
        private iterableLength: number,
        private objectProperties: number
    ) {
        if (steps < 1) throw new Error('steps smaller than 1')
        if (stackSize < 1) throw new Error('stackSize smaller than 1')
        if (heapSize < 1) throw new Error('heapSize smaller than 1')
        if (stringLength < 1) throw new Error('stringLength smaller than 1')
        if (iterableLength < 1) throw new Error('iterableLength smaller than 1')
        if (objectProperties < 1) throw new Error('objectProperties smaller than 1')
    }

    private checkConstraints(event: protocol.Event) {
        if (!event.inspected) return

        const frame = event.inspected.frame
        this.currentStep++
        if (this.currentStep > this.steps) throw new Error(`tracer constraint: max steps exceeded ${this.steps}`)
        if (frame.stack.scopes.length > this.stackSize)
            throw new Error(`tracer constraint: max stack size exceeded ${this.stackSize}`)
        if (Object.keys(frame.heap).length > this.heapSize)
            throw new Error(`tracer constraint: max heap size exceeded ${this.heapSize}`)

        const iterableTypes = [
            protocol.Frame.Heap.Obj.Type.ARRAY,
            protocol.Frame.Heap.Obj.Type.TUPLE,
            protocol.Frame.Heap.Obj.Type.ALIST,
            protocol.Frame.Heap.Obj.Type.LLIST,
            protocol.Frame.Heap.Obj.Type.SET
        ]
        for (const obj of queryObjectTypes(frame, ...iterableTypes))
            if (obj.members.length > this.iterableLength)
                throw new Error(`tracer constraint: max iterable length exceeded ${this.iterableLength}`)

        for (const obj of queryObjectTypes(frame, protocol.Frame.Heap.Obj.Type.OTHER))
            if (obj.userDefined && obj.members.length > this.objectProperties)
                throw new Error(`tracer constraint: max object properties exceeded ${this.objectProperties}`)

        for (const value of queryValueTypes(frame, 'stringValue')) {
            const strValue = value as string
            if ((strValue.startsWith("'") || strValue.startsWith('"')) && strValue.length > this.stringLength + 2)
                throw new Error(`tracer constraint: max string length exceeded ${this.stringLength}`)
        }
    }

    async consume(step: () => Promise<protocol.Event[]>) {
        const results = await step()
        results.forEach(result => this.checkConstraints(result))
        return results
    }
}
