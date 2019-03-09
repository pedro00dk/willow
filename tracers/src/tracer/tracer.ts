import * as protocol from '../protobuf/protocol'

/**
 * Interface for tracer objects. All required functions are operations that shall be implemented by tracer processes,
 * other functions may be implemented using the required functions.
 */
export interface Tracer {
    getState(): 'created' | 'started' | 'stopped'
    start(main: string, code: string): Promise<protocol.Event[]>
    stop(): void
    step(): Promise<protocol.Event[]>
    stepOver?(): Promise<protocol.Event[]>
    stepOut?(): Promise<protocol.Event[]>
    continue?(): Promise<protocol.Event[]>
    input(lines: string[]): void
    getBreakpoints?(): ReadonlySet<number>
    setBreakpoints?(breakpoints: ReadonlySet<number>): void
    addStepProcessor?(stepProcessor: StepProcessor): void
}

/**
 * Interface for step processor objects. Step processors can buffer, filter, change or restrict the generated events.
 */
export interface StepProcessor {
    consume(step: () => Promise<protocol.Event[]>): Promise<protocol.Event[]>
}

/**
 * Applies to all step processors to the received step function.
 */
export function applyStepProcessorStack(stepProcessors: StepProcessor[], step: () => Promise<protocol.Event[]>) {
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
