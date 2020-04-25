import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../../../colors'
import * as tracer from '../../../../../types/tracer'
import { ComputedParameters, Edge, Node } from '../../Graph'
import { getValueDisplay, getValueString, isSameMember, isValueReference } from '../../TracerUtils'

const classes = {
    container: 'd-flex flex-column text-nowrap',
    element: `d-flex px-1 ${css({ border: `0.5px solid ${colors.gray.dark}` })}`,
    key: `text-truncate mr-1 ${css({ borderRight: `0.5px solid ${colors.gray.light}`, fontSize: '0.75rem' })}`,
    value: `text-center text-truncate ${css({ fontSize: '0.75rem' })}`
}

const styles = {
    cellColor: (changed: boolean) => (changed ? colors.yellow.lighter : colors.blue.lighter),
    edgeColor: (changed: boolean) => (changed ? colors.yellow.darker : colors.blue.main)
}

export const defaultParameters = {
    'show keys': { value: true, bool: true as const },
    'key width': { value: 35, range: [5, 100] as [number, number], tick: 5 },
    'value width': { value: 35, range: [5, 100] as [number, number], tick: 5 }
}

export const defaults: ReadonlySet<tracer.Obj['category']> = new Set(['map'])
export const supported: ReadonlySet<tracer.Obj['category']> = new Set(['list', 'set', 'map'])

export const Shape = (props: {
    id: string
    obj: tracer.Obj
    node: Node
    previousMembers: { [id: string]: tracer.Member }
    parameters: ComputedParameters<typeof defaultParameters>
    onReference: (reference: { key: string; target: string; ref$: HTMLSpanElement; edge: Partial<Edge> }) => void
}) => {
    const showKeys = props.parameters['show keys']
    const keyWidth = props.parameters['key width']
    const valueWidth = props.parameters['value width']

    const renderEntry = (member: tracer.Member) => {
        const key = getValueString(member.key)
        const value = getValueString(member.value)
        const displayKey = getValueDisplay(member.key, props.id)
        const displayValue = getValueDisplay(member.value, props.id)
        const isKeyReference = isValueReference(member.key)
        const isValReference = isValueReference(member.value)
        const changed = !isSameMember(member, props.previousMembers[key])

        return (
            <div
                key={key}
                className={classes.element}
                style={{ background: styles.cellColor(changed) }}
                title={displayValue}
            >
                {showKeys && (
                    <span
                        ref={ref$ => {
                            if (!ref$ || !isKeyReference) return
                            props.onReference({
                                key: `${key}-key`,
                                target: key,
                                ref$,
                                edge: { color: styles.edgeColor(changed) }
                            })
                        }}
                        className={classes.key}
                        style={{ width: keyWidth }}
                    >
                        {displayKey}
                    </span>
                )}
                <span
                    ref={ref$ => {
                        if (!ref$ || !isValReference) return
                        props.onReference({
                            key,
                            target: value,
                            ref$,
                            edge: { color: styles.edgeColor(changed), text: displayKey }
                        })
                    }}
                    className={classes.value}
                    style={{ width: valueWidth }}
                >
                    {displayValue}
                </span>
            </div>
        )
    }

    return (
        <div className={classes.container}>
            {!supported.has(props.obj.category) ? (
                <span title={'Object type not supported by shape'}>{'error'}</span>
            ) : props.obj.members.length === 0 ? (
                <span title={'Object is empty'}>{'{ }'}</span>
            ) : (
                props.obj.members.map(member => renderEntry(member))
            )}
        </div>
    )
}
