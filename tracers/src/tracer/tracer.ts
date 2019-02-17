import { Result } from '../result'
import { Tracer } from './tracer'


/**
 * Interface for tracer objects.
 */
export interface Tracer {

    /**
     * Returns the current state of the tracer
     */
    getState(): 'created' | 'started' | 'stopped'

    /**
     * Starts the tracer process.
     */
    start(): Promise<Result[]>

    /**
     * Forces the tracer to stop.
     */
    stop(): void

    /**
     * Sends text as input to the traced code.
     */
    input(data: string): void

    /**
     * Steps into the traced code.
     */
    step(): Promise<Result[]>

    /**
     * Steps over the traced code.
     */
    stepOver?(): Promise<Result[]>

    /**
     * Steps out the traced code.
     */
    stepOut?(): Promise<Result[]>

    /**
     * Steps until next breakpoint or de code ends.
     */
    continue?(): Promise<Result[]>

    /**
     * Gets the set of breakpoints.
     */
    getBreakpoints?(): number[]

    /**
     * Sets the received breakpoints, removing the previous ones.
     */
    setBreakpoints?(line: number[]): void

    /**
     * Adds a step processor to the step call.
     */
    addStepProcessor?(processor: StepProcessor): void
}

/**
 * Interface for step processor objects.
 */
export interface StepProcessor {

    /**
     * Consumes the base step function to make any type of processes with the function results.
     */
    consume(step: () => Promise<Result[]>): Promise<Result[]>
}

/**
 * Applies to all processors the received step function.
 */
export function applyStepPreprocessorStack(processors: StepProcessor[], step: () => Promise<Result[]>) {
    return processors.reduceRight((acc, processor) => () => processor.consume(acc), step)()
}
