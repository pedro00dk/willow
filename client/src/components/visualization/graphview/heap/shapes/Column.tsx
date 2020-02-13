import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../../../colors'
import * as schema from '../../../../../schema/schema'
import { Base } from './Base'
import { ComputedParameters, Edge, readParameters, UnknownParameters } from '../../GraphData'
import { getDisplayValue, getMemberName, isSameMember } from '../../SchemaUtils'
import { Parameters } from '../Parameters'

const classes = {
    container: 'd-flex align-items-end text-nowrap',
    element: cn('d-flex flex-column px-1', css({ border: `0.5px solid ${colors.gray.dark}` })),
    index: cn('text-truncate mr-1', css({ fontSize: '0.5rem' })),
    value: cn('text-center text-truncate', css({ fontSize: '0.75rem' })),
    column: css({ borderBottom: `1px solid ${colors.gray.dark}` })
}

const styles = {
    background: (changed: boolean) => (changed ? colors.yellow.light : colors.blue.light)
}

const defaultParameters = {
    'show indices': { value: true },
    'show values': { value: true },
    'column width': { value: 35, range: [5, 100] as [number, number] },
    'column height': { value: 60, range: [5, 200] as [number, number] },
    'delta mode': { value: 'diff', options: ['diff', 'step'] }
}

export const defaults: ReadonlySet<schema.Obj['gType']> = new Set()
export const supported: ReadonlySet<schema.Obj['gType']> = new Set(['array', 'linked'])

export const Shape = (props: {
    id: string
    obj: schema.Obj
    parameters: UnknownParameters
    onLink: (link: { id: string; name: string; ref$: HTMLSpanElement } & Partial<Edge>) => void
}) => {
    const currentMembers = React.useRef<{ [id: string]: schema.Member }>({})
    const parameters = readParameters(props.parameters, defaultParameters)
    const showIndices = parameters['show indices']
    const showValues = parameters['show values']
    const columnWidth = parameters['column width']
    const columnHeight = parameters['column height']
    const deltaMode = parameters['delta mode']

    React.useEffect(() => {
        currentMembers.current = props.obj.members.reduce((acc, member) => {
            acc[getMemberName(member)] = member
            return acc
        }, {} as { [name: string]: schema.Member })
    })

    const computeDiffRatios = (values: number[]) => {
        const min = Math.min(...values)
        const max = Math.max(...values)
        const delta = max - min !== 0 ? max - min : 1
        return values.map(value => (value - min) / delta)
    }

    const computeStepRatios = (values: number[]) => {
        const indexedValues = values.map((value, i) => [value, i])
        indexedValues.sort((a, b) => a[0] - b[0])
        const sequenceGenerator = { previous: -Infinity, sequence: 0 }
        const sequenceIndices = indexedValues.map(([value, i]) => {
            if (sequenceGenerator.previous !== value) {
                sequenceGenerator.previous = value
                return [++sequenceGenerator.sequence, i]
            }
            return [sequenceGenerator.sequence, i]
        })
        const min = sequenceIndices[0][0]
        const max = sequenceIndices[sequenceIndices.length - 1][0]
        const delta = max - min !== 0 ? max - min : 1
        const ratioIndices = sequenceIndices.map(([value, i]) => [(value - min) / delta, i])
        ratioIndices.sort((a, b) => a[1] - b[1])
        return ratioIndices.map(([value, i]) => value)
    }

    const renderColumn = (member: schema.Member, ratio: number, columnIndex: number) => {
        const name = getMemberName(member)
        const displayIndex = (member.key as number).toString()
        const displayValue = getDisplayValue(member.value, props.id)
        const changed = !isSameMember(member, currentMembers.current[name])

        return (
            <div
                key={columnIndex}
                className={classes.element}
                style={{ background: styles.background(changed), width: columnWidth }}
                title={displayValue}
            >
                <div className={classes.column} style={{ height: `${ratio * columnHeight}px` }} />
                {showIndices && <span className={classes.index}>{displayIndex}</span>}
                {showValues && <span className={classes.value}>{displayValue}</span>}
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
                    : props.obj.members.some(member => typeof member.value !== 'number' || !isFinite(member.value))
                    ? 'contains non number'
                    : (() => {
                          const values = props.obj.members.map(member => member.value as number)
                          const ratios = deltaMode === 'diff' ? computeDiffRatios(values) : computeStepRatios(values)
                          return props.obj.members.map((member, i) => renderColumn(member, ratios[i], i))
                      })()}
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
