import * as schema from '../../../schema/schema'

export const getMemberName = (member: schema.Member) =>
    typeof member.key !== 'object' ? member.key.toString() : `[${member.key[0].toString()}]`

export const isValueObject = (value: schema.Value): value is [string] => typeof value === 'object'

export const isSameMember = (memberA: schema.Member, memberB: schema.Member) => {
    if ((!memberA && memberB) || (!memberB && memberA)) return false
    if (!memberA && !memberB) return true
    return getMemberName(memberA) === getMemberName(memberB) && isSameValue(memberA.value, memberB.value)
}

export const isSameValue = (valueA: schema.Value, valueB: schema.Value) => {
    const aIsObject = isValueObject(valueA)
    const bIsObject = isValueObject(valueB)
    return (
        (!aIsObject && !bIsObject && valueA === valueB) ||
        (aIsObject && bIsObject && (valueA as [string])[0] === (valueB as [string])[0])
    )
}

export const getDisplayValue = (value: schema.Value, containerId?: string) =>
    isValueObject(value) ? (value[0] === containerId ? ':#:' : '::') : value.toString()
