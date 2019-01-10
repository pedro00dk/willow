import { Result } from '../result'
import { type } from 'os';

/**
 * Interface for tracer objects.
 */
export interface Tracer {

    /**
     * Returns the current state of the tracer
     */
    getState() : 'created' | 'started' | 'stopped'
    
    /**
     * Starts the tracer process.
     */
    start(): Promise<Array<Result>>

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
    step(): Promise<Array<Result>>

    /**
     * Steps over the traced code.
     */
    stepOver?(): Promise<Array<Result>>

    /**
     * Steps out the traced code.
     */
    stepOut?(): Promise<Array<Result>>

    /**
     * Steps until next breakpoint or de code ends.
     */
    continue?(): Promise<Array<Result>>

    /**
     * Sets a breakpoint in a line.
     */
    setBreakpoint?(line: number): void

    /**
     * Gets the set of breakpoints.
     */
    getBreakpoints?(): Set<number>
}