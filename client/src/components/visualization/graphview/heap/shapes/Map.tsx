import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../../../colors'
import * as schema from '../../../../../schema/schema'
import { Base } from './Base'
import { ComputedParameters, Edge, readParameters, UnknownParameters } from '../../GraphData'
import { getDisplayValue, getMemberName, isSameMember, isValueObject } from '../../SchemaUtils'
import { Parameters } from '../Parameters'

const classes = {
    container: 'd-flex flex-column text-nowrap',
    element: cn('d-flex px-1', css({ border: `0.5px solid ${colors.gray.dark}` })),
    key: cn('text-truncate mr-1', css({ borderRight: `0.5px solid ${colors.gray.light}`, fontSize: '0.75rem' })),
    value: cn('text-center text-truncate', css({ fontSize: '0.75rem' }))
}

const styles = {
    background: (changed: boolean) => (changed ? colors.yellow.light : colors.blue.light),
    edge: (changed: boolean) => (changed ? colors.yellow.darker : colors.gray.dark)
}

const defaultParameters = {
    'show keys': { value: true },
    'key width': { value: 35, range: [5, 100] as [number, number] },
    'value width': { value: 35, range: [5, 100] as [number, number] }
}

export const defaults: ReadonlySet<schema.Obj['gType']> = new Set(['map'])
export const supported: ReadonlySet<schema.Obj['gType']> = new Set(['array', 'linked', 'set', 'map'])

export const Shape = (props: {
    id: string
    obj: schema.Obj
    parameters: UnknownParameters
    onLink: (
        link: { id: string; ref$: HTMLSpanElement } & Pick<Partial<Edge>, 'draw' | 'color' | 'width' | 'text'>
    ) => void
}) => {
    const currentMembers = React.useRef<{ [id: string]: schema.Member }>({})
    const parameters = readParameters(props.parameters, defaultParameters)
    const showKeys = parameters['show keys']
    const keyWidth = parameters['key width']
    const valueWidth = parameters['value width']

    React.useEffect(() => {
        currentMembers.current = props.obj.members.reduce((acc, member) => {
            acc[getMemberName(member)] = member
            return acc
        }, {} as { [name: string]: schema.Member })
    })

    const renderEntry = (member: schema.Member) => {
        const displayKey = getDisplayValue(member.key, props.id)
        const displayValue = getDisplayValue(member.value, props.id)
        const isKeyObject = isValueObject(member.key)
        const isValObject = isValueObject(member.value)
        const memberName = getMemberName(member)
        const changed = !isSameMember(member, currentMembers.current[memberName])

        return (
            <div
                key={memberName}
                className={classes.element}
                style={{ background: styles.background(changed) }}
                title={displayValue}
            >
                {showKeys && (
                    <span
                        ref={ref$ => {
                            if (!ref$ || !isKeyObject) return
                            const targetId = (member.key as [string])[0]
                            props.onLink({ id: targetId, ref$, color: styles.edge(changed) })
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
                        const targetId = (member.value as [string])[0]
                        props.onLink({ id: targetId, ref$, color: styles.edge(changed), text: displayKey })
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

export const ShapeParameters = (props: {
    id: string
    obj: schema.Obj
    withReset: boolean
    parameters: UnknownParameters
    onChange: (updatedParameters: ComputedParameters<typeof defaultParameters>) => void
}) => (
    <Parameters
        withReset={props.withReset}
        parameters={props.parameters}
        defaults={defaultParameters}
        onChange={props.onChange}
    />
)
