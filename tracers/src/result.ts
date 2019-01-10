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
    stack_lines: StackLinesType
    stack_references: StackReferencesType
    heap_graph: HeapGraphType
    user_classes: UserClassesType
    finish: FinishType
}

export type EventType = 'call' | 'line' | 'exception' | 'return'

export type ArgsType = null | ArgsExceptionType
export type ArgsExceptionType = { type: string, args: any, traceback: string }

export type LineType = number

export type StackLinesType = Array<ScopeLineType>
export type ScopeLineType = { name: string, line: number }

export type StackReferencesType = Array<ScopeReferencesType>
export type ScopeReferencesType = Array<ScopeReferenceType>
export type ScopeReferenceType = [string, AnyType]

export type HeapGraphType = Map<string, HeapObjectType>
export type HeapObjectType = { type: string, members: Array<HeapObjectMemberType> }
export type HeapObjectMemberType = [AnyType, AnyType]

export type AnyType = LiteralType | ReferenceType
export type LiteralType = boolean | number | string
export type ReferenceType = [number]

export type UserClassesType = Array<string>

export type FinishType = boolean
