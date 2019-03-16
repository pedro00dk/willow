import * as protocol from '../protobuf/protocol'

/**
 * Interface for tracer objects. All required functions are operations that shall be implemented by tracer processes,
 * other functions may be implemented using the required functions.
 */
export interface Tracer {
    getState(): 'created' | 'started' | 'stopped'
    start(start: protocol.Action.Start): Promise<protocol.TracerResponse>
    stop(): void
    step(): Promise<protocol.TracerResponse>
    stepOver?(): Promise<protocol.TracerResponses>
    stepOut?(): Promise<protocol.TracerResponses>
    continue?(): Promise<protocol.TracerResponses>
    input(input: protocol.Action.Input): void
    getBreakpoints?(): protocol.Breakpoints
    setBreakpoints?(breakpoints: protocol.Breakpoints): void
    addStepProcessor?(stepProcessor: ResponseProcessor): void
}

/**
 * Interface for step processor objects. Step processors can buffer, filter, change or restrict the generated events.
 */
export interface ResponseProcessor {
    consume(step: () => Promise<protocol.TracerResponse>): Promise<protocol.TracerResponse>
}

/**
 * Applies to all step processors to the received step function.
 */
export function applyResponseProcessorStack(
    stepProcessors: ResponseProcessor[],
    step: () => Promise<protocol.TracerResponse>
) {
    return stepProcessors.reduceRight((acc, processor) => () => processor.consume(acc), step)()
}

// Event processing helper functions

/**
 * Queries through a generator all objects of the received types from a frame.
 */
export function* queryObjectTypes(frame: protocol.Frame, ...types: protocol.Frame.Heap.Obj.Type[]) {
    const typeSet = new Set(types)
    for (const obj of Object.values(frame.heap.references)) if (typeSet.has(obj.type)) yield obj
}

/**
 * Queries through a generator all values of a set of types from a frame.
 */
export function* queryValueTypes(frame: protocol.Frame, ...types: protocol.Frame.Value['value'][]) {
    const typeSet = new Set<string>(types)
    for (const scope of frame.stack.scopes)
        for (const variable of Object.values(scope.variables))
            if (typeSet.has(variable.value.value)) yield variable.value[variable.value.value]
    for (const obj of Object.values(frame.heap.references))
        for (const member of obj.members) {
            if (typeSet.has(member.key.value)) yield member.key[member.key.value]
            if (typeSet.has(member.value.value)) yield member.value[member.value.value]
        }
}
