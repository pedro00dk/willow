import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../../../colors'
import * as schema from '../../../../../schema/schema'
import { Base } from './Base'
import { Edge, readParameters, UnknownParameters } from '../../GraphData'
import { getDisplayValue, getMemberName, isSameMember, isValueObject } from '../../SchemaUtils'

const classes = {
    container: 'd-flex flex-column text-nowrap',
    element: cn('d-flex px-1', css({ border: `0.5px solid ${colors.gray.dark}` })),
    key: cn('text-truncate mr-1', css({ borderRight: `0.5px solid ${colors.gray.light}`, fontSize: '0.75rem' })),
    value: cn('text-center text-truncate', css({ fontSize: '0.75rem' }))
}

const styles = {
    background: (changed: boolean) => (changed ? colors.yellow.light : colors.blue.light),
    color: (changed: boolean) => (changed ? colors.yellow.darker : colors.gray.dark)
}

export const defaultParameters = {
    'show keys': { value: true, bool: true as const },
    'key width': { value: 35, range: [5, 100] as [number, number] },
    'value width': { value: 35, range: [5, 100] as [number, number] }
}

export const defaults: ReadonlySet<schema.Obj['gType']> = new Set(['map'])
export const supported: ReadonlySet<schema.Obj['gType']> = new Set(['array', 'linked', 'set', 'map'])

export const Shape = (props: {
    id: string
    obj: schema.Obj
    previousMembers: { [id: string]: schema.Member }
    parameters: UnknownParameters
    onReference: (reference: { id: string; name: string; ref$: HTMLSpanElement; edge: Partial<Edge> }) => void
}) => {
    const parameters = readParameters(props.parameters, defaultParameters)
    const showKeys = parameters['show keys']
    const keyWidth = parameters['key width']
    const valueWidth = parameters['value width']

    const renderEntry = (member: schema.Member) => {
        const name = getMemberName(member)
        const displayKey = getDisplayValue(member.key, props.id)
        const displayValue = getDisplayValue(member.value, props.id)
        const isKeyObject = isValueObject(member.key)
        const isValObject = isValueObject(member.value)
        const changed = !isSameMember(member, props.previousMembers[name])

        return (
            <div
                key={name}
                className={classes.element}
                style={{ background: styles.background(changed) }}
                title={displayValue}
            >
                {showKeys && (
                    <span
                        ref={ref$ => {
                            if (!ref$ || !isKeyObject) return
                            props.onReference({
                                id: (member.key as [string])[0],
                                name: `${name}-key`,
                                ref$,
                                edge: { color: styles.color(changed) }
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
                        if (!ref$ || !isValObject) return
                        props.onReference({
                            id: (member.value as [string])[0],
                            name,
                            ref$,
                            edge: { color: styles.color(changed), text: displayKey }
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
        <Base title={props.obj.lType}>
            <div className={classes.container}>
                {!supported.has(props.obj.gType)
                    ? 'incompatible'
                    : props.obj.members.length === 0
                    ? 'empty'
                    : props.obj.members.map(member => renderEntry(member))}
            </div>
        </Base>
    )
}
