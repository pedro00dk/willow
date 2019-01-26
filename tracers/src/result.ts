// Result fields
export type Result = {
    name: ResultType
    value: ValueType
}

export type ResultType = 'started' | 'error' | 'data' | 'product' | 'print' | 'prompt' | 'locked'
export type ValueType = null | string | Event


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
export type ArgsExceptionType = { type: string, args: any, traceback: string }

export type LineType = number

export type StackLinesType = ScopeLineType[]
export type ScopeLineType = { name: string, line: number }

export type StackReferencesType = ScopeReferencesType[]
export type ScopeReferencesType = ScopeReferenceType[]
export type ScopeReferenceType = [string, AnyType]

export type HeapGraphType = Map<string, HeapObjectType>
export type HeapObjectType = { type: string, languageType: string, members: HeapObjectMemberType[] }
export type GenericType = 'list' | 'set' | 'map' | 'udo' // udo => user defined object
export type HeapObjectMemberType = [AnyType, AnyType]

export type AnyType = LiteralType | ReferenceType
export type LiteralType = boolean | number | string
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
