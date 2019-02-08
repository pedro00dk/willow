// Result fields
export type Result = {
    name: ResultNameType
    value: ResultValueType
}

export type ResultNameType = 'started' | 'error' | 'data' | 'product' | 'print' | 'prompt' | 'locked'
export type ResultValueType = null | string | Event


// Event fields
export type Event = {
    name: EventType
    args: ArgsType
    line: number
    stackLines: StackLinesType
    stackReferences: StackReferencesType
    heapGraph: HeapGraphType
    userClasses: UserClassesType
    finish: FinishType
}

export type EventType = 'call' | 'line' | 'exception' | 'return'

export type ArgsType = null | ArgsExceptionType
export type ArgsExceptionType = { type: string, args: unknown, traceback: string }

export type LineType = number

export type StackLinesType = ScopeLineType[]
export type ScopeLineType = { name: string, line: number }

export type StackReferencesType = ScopeReferencesType[]
export type ScopeReferencesType = ScopeReferenceType[]
export type ScopeReferenceType = [string, AnyType]

export type HeapGraphType = { [reference: string]: HeapObjectType }
export type HeapObjectType = { type: string, languageType: string, members: HeapObjectMemberType[] }
export type GenericType = 'list' | 'set' | 'map' | 'udo' // udo => user defined object
export type HeapObjectMemberType = [AnyType, AnyType]

export type AnyType = ValueType | ReferenceType
export type ValueType = boolean | number | string // strings are better represented as value types
export type ReferenceType = [number]

export type UserClassesType = string[]

export type FinishType = boolean


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
    return result.name === 'data' && (result.value as Event).finish
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
