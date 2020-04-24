import * as tracer from '../../../types/tracer'

export const isValueReference = (value: tracer.Value): value is [string] => typeof value === 'object'

export const isSameValue = (valueA: tracer.Value, valueB: tracer.Value) => {
    const aIsObject = isValueReference(valueA)
    const bIsObject = isValueReference(valueB)
    return (
        (!aIsObject && !bIsObject && valueA === valueB) ||
        (aIsObject && bIsObject && (valueA as [string])[0] === (valueB as [string])[0])
    )
}

export const isSameMember = (memberA: tracer.Member, memberB: tracer.Member) => {
    if ((!memberA && memberB) || (!memberB && memberA)) return false
    if (!memberA && !memberB) return true
    return getValueString(memberA.key) === getValueString(memberB.key) && isSameValue(memberA.value, memberB.value)
}

export const getValueString = (value: tracer.Value) => (isValueReference(value) ? value[0] : value).toString()

export const getValueDisplay = (value: tracer.Value, containerId?: string) =>
    isValueReference(value) ? (value[0] === containerId ? '::#' : '::') : value.toString()
