import * as tracer from '../../../types/tracer'

export const getMemberName = (member: tracer.Member) =>
    typeof member.key !== 'object' ? member.key.toString() : `[${member.key[0].toString()}]`

export const isValueObject = (value: tracer.Value): value is [string] => typeof value === 'object'

export const isSameMember = (memberA: tracer.Member, memberB: tracer.Member) => {
    if ((!memberA && memberB) || (!memberB && memberA)) return false
    if (!memberA && !memberB) return true
    return getMemberName(memberA) === getMemberName(memberB) && isSameValue(memberA.value, memberB.value)
}

export const isSameValue = (valueA: tracer.Value, valueB: tracer.Value) => {
    const aIsObject = isValueObject(valueA)
    const bIsObject = isValueObject(valueB)
    return (
        (!aIsObject && !bIsObject && valueA === valueB) ||
        (aIsObject && bIsObject && (valueA as [string])[0] === (valueB as [string])[0])
    )
}

export const getDisplayValue = (value: tracer.Value, containerId?: string) =>
    isValueObject(value) ? (value[0] === containerId ? ':#:' : '::') : value.toString()
