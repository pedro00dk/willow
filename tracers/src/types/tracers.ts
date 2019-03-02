/**
 * Specification for actions acceptable by tracers, input action shall be followed by the input value.
 */
export type Action = 'start' | 'stop' | 'input' | 'step'

/**
 * Specification for result objects from tracers.
 */
export type Result =
    { name: 'started', value: null } |
    { name: 'error', value: Exception } |
    { name: 'data', value: Event } |
    { name: 'print' | 'prompt' | 'locked', value: string }

/**
 * Specification for exception objects.
 */
export type Exception = {
    type: string
    args: unknown[]
    traceback: string[]
}

/**
 * Specification for event values from a data result.
 */
export type Event = {
    name: 'call' | 'line' | 'exception' | 'return'
    args: null | Exception
    line: number
    stackLines: StackInfo
    stackReferences: StackReferences
    heapGraph: HeapGraph
    userClasses: string[]
    finish: boolean
}

export type StackInfo = ScopeInfo[]
export type ScopeInfo = { name: string, line: number }

export type StackReferences = ScopeReferences[]
export type ScopeReferences = [string, AnyType][]

export type HeapGraph = { [reference: string]: HeapObject }
export type HeapObject = { type: GenericType, languageType: string, members: HeapObjectMemberType[] }
export type GenericType = 'list' | 'set' | 'map' | 'udo' // udo => user defined object
export type HeapObjectMemberType = [AnyType, AnyType]

export type AnyType = ValueType | ReferenceType
export type ValueType = boolean | number | string // strings are better represented as value types
export type ReferenceType = [number]

// Results utility functions

/**
 * Returns true if is a error type result.
 */
export function isErrorResult(result: Result) {
    return result.name === 'error'
}

/**
 * Returns true if a result is the last emitted by the tracer.
 */
export function isLastResult(result: Result) {
    return result.name === 'data' && result.value.finish
}

/**
 * Queries through a generator all value type object of the received type string.
 */
export function* queryValueTypes(event: Event, ...types: ('boolean' | 'number' | 'string')[]) {
    const typeSet = new Set<string>(types)
    for (const scopeReference of event.stackReferences) for (const [, value] of scopeReference)
        if (typeSet.has(typeof value)) yield value

    for (const { members } of Object.values(event.heapGraph)) for (const [key, value] of members) {
        if (typeSet.has(typeof key)) yield key
        if (typeSet.has(typeof value)) yield value
    }
}

/**
 * Queries through a generator all reference type object of the received type string.
 */
export function* queryReferenceTypes(event: Event, ...types: GenericType[]) {
    const typeSet = new Set<string>(types)
    for (const heapObject of Object.values(event.heapGraph))
        if (typeSet.has(heapObject.type)) yield heapObject
}
