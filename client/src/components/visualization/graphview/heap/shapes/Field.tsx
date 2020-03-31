import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../../../colors'
import * as tracer from '../../../../../types/tracer'
import { Base } from './Base'
import { ComputedParameters, Edge } from '../../Graph'
import { getDisplayValue, getMemberName, isSameMember, isValueObject } from '../../TracerUtils'

const classes = {
    container: 'd-flex text-nowrap',
    elements: 'd-flex',
    element: `d-flex flex-column px-1 ${css({ border: `0.5px solid ${colors.gray.dark}` })}`,
    key: `text-truncate mr-1 ${css({ fontSize: '0.5rem' })}`,
    value: `text-center text-truncate ${css({ fontSize: '0.75rem' })}`
}

const styles = {
    background: (changed: boolean) => (changed ? colors.yellow.light : colors.blue.light),
    color: (changed: boolean) => (changed ? colors.yellow.darker : colors.gray.dark)
}

export const defaultParameters = {
    member: { value: undefined as string, members: 'all' as const, self: false },
    'show key': { value: true, bool: true as const },
    'show references': { value: false, bool: true as const },
    'reference position': { value: 'bottom', options: ['right', 'bottom'] }
}

export const defaults: ReadonlySet<tracer.Obj['category']> = new Set()
export const supported: ReadonlySet<tracer.Obj['category']> = new Set(['list', 'map'])

export const Shape = (props: {
    id: string
    obj: tracer.Obj
    previousMembers: { [id: string]: tracer.Member }
    parameters: ComputedParameters<typeof defaultParameters>
    onReference: (reference: { id: string; name: string; ref$: HTMLSpanElement; edge: Partial<Edge> }) => void
}) => {
    const members = Object.fromEntries(props.obj.members.map(member => [getMemberName(member), member]))
    const memberName = props.parameters.member
    const showKey = props.parameters['show key']
    const showReferences = props.parameters['show references']
    const referencePosition = props.parameters['reference position']

    const renderField = (member: tracer.Member) => {
        const name = getMemberName(member)
        const displayKey = getDisplayValue(member.key, props.id)
        const displayValue = getDisplayValue(member.value, props.id)
        const isObject = isValueObject(member.value)
        const changed = !isSameMember(member, props.previousMembers[name])

        return (
            <div
                className={classes.elements}
                style={{ flexDirection: referencePosition === 'right' ? 'row' : 'column' }}
            >
                <div
                    className={classes.element}
                    style={{ background: styles.background(changed) }}
                    title={displayValue}
                >
                    {showKey && <span className={classes.key}>{displayKey}</span>}
                    <span
                        ref={ref$ => {
                            if (!ref$ || !isObject) return
                            props.onReference({
                                id: (member.value as [string])[0],
                                name,
                                ref$,
                                edge: { color: styles.color(changed), text: displayKey }
                            })
                        }}
                        className={classes.value}
                    >
                        {displayValue}
                    </span>
                </div>
                {showReferences && renderReferences(member)}
            </div>
        )
    }

    const renderReferences = (member: tracer.Member) => (
        <span
            ref={ref$ => {
                if (!ref$) return
                props.obj.members.forEach(refMember => {
                    if (!isValueObject(refMember.value) || refMember === member) return
                    const targetId = (refMember.value as [string])[0]
                    const name = getMemberName(refMember)
                    const displayKey = getDisplayValue(refMember.key, props.id)
                    const changed = !isSameMember(refMember, props.previousMembers[name])
                    props.onReference({
                        id: targetId,
                        name,
                        ref$,
                        edge: { color: styles.color(changed), text: displayKey }
                    })
                })
            }}
        />
    )

    return (
        <Base title={props.obj.type}>
            <div className={classes.container}>
                {!supported.has(props.obj.category)
                    ? 'incompatible'
                    : memberName == undefined
                    ? 'choose'
                    : !members[memberName]
                    ? 'not found'
                    : renderField(members[memberName])}
            </div>
        </Base>
    )
}
