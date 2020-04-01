/**
 * Specification of tracer requests and responses.
 */

/**
 * Request contains source code, inputs and maximum amount of steps to execute.
 */
export type Request = {
    source?: string
    input?: string
    steps?: number
}
/**
 * Response stores a list of all computed steps of a program.
 */
export type Response = {
    steps: Step[]
}

/**
 * Step stores the information of a program at a certain execution point.
 */
export type Step = {
    snapshot?: Snapshot
    error?: Error
    print?: string
}

/**
 * Snapshot contains the state of a program at a certain execution point.
 */
export type Snapshot = {
    event: 'line' | 'call' | 'return' | 'exception'
    stack: Scope[]
    heap: { [k: string]: Obj }
}
/**
 * Scope stores basic data and variables that may point to the heap.
 */
export type Scope = {
    line: number
    name: string
    members: Member[]
}

/**
 * An object allocated in the heap.
 */
export type Obj = {
    id: string
    type: string
    category: 'list' | 'set' | 'map' | 'other'
    members: Member[]
}

/**
 * Member is a variable of a scope or element of an object.
 */
export type Member = {
    key: Value
    value: Value
}

/**
 * Value is the representation of any variable or property content.
 */
export type Value = number | string | [string]

/**
 * Indicates that the program or the tracer stopped due to some problem.
 */
export type Error = {
    exception?: Exception
    cause?: string
}

/**
 * Uncaught error of the program or the tracer itself.
 */
export type Exception = {
    type: string
    traceback: string
}
