import { Result } from '../result'


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
    getBreakpoints?(): Set<number>

    /**
     * Sets a breakpoint in a line.
     */
    setBreakpoint?(line: number): void
}
