import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../../../colors'
import * as tracer from '../../../../../types/tracer'
import { ComputedParameters, Edge, Node } from '../../Graph'
import { getValueDisplay, getValueString, isSameMember } from '../../TracerUtils'

const classes = {
    container: 'd-flex align-items-end text-nowrap',
    element: `d-flex flex-column px-1 ${css({ border: `0.5px solid ${colors.gray.dark}` })}`,
    index: `text-truncate mr-1 ${css({ fontSize: '0.5rem' })}`,
    value: `text-center text-truncate ${css({ fontSize: '0.75rem' })}`,
    column: css({ borderBottom: `1px solid ${colors.gray.dark}` })
}

const styles = {
    cellColor: (changed: boolean) => (changed ? colors.yellow.lighter : colors.blue.lighter)
}

export const defaultParameters = {
    'show indices': { value: true, bool: true as const },
    'show values': { value: true, bool: true as const },
    'column width': { value: 35, range: [5, 100] as [number, number], tick: 5 },
    'column height': { value: 60, range: [5, 200] as [number, number], tick: 5 },
    'column diff': { value: 'delta', options: ['delta', 'step'] }
}

export const defaults: ReadonlySet<tracer.Obj['category']> = new Set()
export const supported: ReadonlySet<tracer.Obj['category']> = new Set(['list'])

export const Shape = (props: {
    id: string
    obj: tracer.Obj
    node: Node
    previousMembers: { [id: string]: tracer.Member }
    parameters: ComputedParameters<typeof defaultParameters>
    onReference: (reference: { key: string; target: string; ref$: HTMLSpanElement; edge: Partial<Edge> }) => void
}) => {
    const showIndices = props.parameters['show indices']
    const showValues = props.parameters['show values']
    const columnWidth = props.parameters['column width']
    const columnHeight = props.parameters['column height']
    const columnDiff = props.parameters['column diff']

    const computeDeltaRatios = (values: number[]) => {
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

    const renderColumn = (member: tracer.Member, ratio: number, columnIndex: number) => {
        const key = getValueString(member.key)
        const displayIndex = (member.key as number).toString()
        const displayValue = getValueDisplay(member.value, props.id)
        const changed = !isSameMember(member, props.previousMembers[key])

        return (
            <div
                key={columnIndex}
                className={classes.element}
                style={{ background: styles.cellColor(changed), width: columnWidth }}
                title={displayValue}
            >
                <div className={classes.column} style={{ height: `${ratio * columnHeight}px` }} />
                {showIndices && <span className={classes.index}>{displayIndex}</span>}
                {showValues && <span className={classes.value}>{displayValue}</span>}
            </div>
        )
    }

    return (
        <div className={classes.container}>
            {!supported.has(props.obj.category) ? (
                <span title={'Object type not supported by shape'}>{'error'}</span>
            ) : props.obj.members.length === 0 ? (
                <span title={'Object is empty'}>{'[]'}</span>
            ) : props.obj.members.some(member => typeof member.value !== 'number' || !isFinite(member.value)) ? (
                <span title={'Object contains non number or infinity value'}>{'error'}</span>
            ) : (
                (() => {
                    const values = props.obj.members.map(member => member.value as number)
                    const ratios = columnDiff === 'delta' ? computeDeltaRatios(values) : computeStepRatios(values)
                    return props.obj.members.map((member, i) => renderColumn(member, ratios[i], i))
                })()
            )}
        </div>
    )
}
