import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../../../colors'
import * as tracer from '../../../../../types/tracer'
import { ComputedParameters, Edge, Node } from '../../Graph'
import { getValueDisplay, getValueString, isSameMember, isValueReference } from '../../TracerUtils'

const classes = {
    container: 'd-flex text-nowrap',
    elements: 'd-flex',
    element: `d-flex flex-column px-1 ${css({ border: `0.5px solid ${colors.gray.dark}` })}`,
    key: `text-truncate mr-1 ${css({ fontSize: '0.5rem' })}`,
    value: `text-center text-truncate ${css({ fontSize: '0.75rem' })}`
}

const styles = {
    cellColor: (changed: boolean) => (changed ? colors.yellow.lighter : colors.blue.lighter),
    edgeColor: (changed: boolean) => (changed ? colors.yellow.darker : colors.blue.main)
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
    node: Node
    previousMembers: { [id: string]: tracer.Member }
    parameters: ComputedParameters<typeof defaultParameters>
    onReference: (reference: { key: string; target: string; ref$: HTMLSpanElement; edge: Partial<Edge> }) => void
}) => {
    const members = Object.fromEntries(props.obj.members.map(member => [getValueString(member.key), member]))
    const memberName = props.parameters.member
    const showKey = props.parameters['show key']
    const showReferences = props.parameters['show references']
    const referencePosition = props.parameters['reference position']

    const renderField = (member: tracer.Member) => {
        const key = getValueString(member.key)
        const displayKey = getValueDisplay(member.key, props.id)
        const displayValue = getValueDisplay(member.value, props.id)
        const isReference = isValueReference(member.value)
        const changed = !isSameMember(member, props.previousMembers[key])

        return (
            <div
                className={classes.elements}
                style={{ flexDirection: referencePosition === 'right' ? 'row' : 'column' }}
            >
                <div className={classes.element} style={{ background: styles.cellColor(changed) }} title={displayValue}>
                    {showKey && <span className={classes.key}>{displayKey}</span>}
                    <span
                        ref={ref$ => {
                            if (!ref$ || !isReference) return
                            props.onReference({
                                key,
                                target: getValueString(member.value),
                                ref$,
                                edge: { color: styles.edgeColor(changed), text: displayKey }
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
                props.obj.members.forEach(remainingMember => {
                    if (!isValueReference(remainingMember.value) || remainingMember === member) return
                    const key = getValueString(remainingMember.key)
                    const target = getValueString(remainingMember.value)
                    const displayKey = getValueDisplay(remainingMember.key, props.id)
                    const changed = !isSameMember(remainingMember, props.previousMembers[key])
                    props.onReference({
                        key,
                        target,
                        ref$,
                        edge: { color: styles.edgeColor(changed), text: displayKey }
                    })
                })
            }}
        />
    )

    return (
        <div className={classes.container}>
            {!supported.has(props.obj.category) ? (
                <span title={'Object type not supported by shape'}>{'error'}</span>
            ) : memberName == undefined ? (
                <span title={'Choose a member to be displayed'}>{'choose'}</span>
            ) : !members[memberName] ? (
                <span title={'The chosen member is missing'}>{'missing'}</span>
            ) : (
                renderField(members[memberName])
            )}
        </div>
    )
}
