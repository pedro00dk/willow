import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../../../colors'
import * as tracer from '../../../../../types/tracer'
import { Base } from './Base'
import { Edge, readParameters, UnknownParameters } from '../../Graph'
import { getDisplayValue, getMemberName, isSameMember } from '../../TracerUtils'

const classes = {
    container: 'd-flex align-items-end text-nowrap',
    element: `d-flex flex-column px-1 ${css({ border: `0.5px solid ${colors.gray.dark}` })}`,
    index: `text-truncate mr-1 ${css({ fontSize: '0.5rem' })}`,
    value: `text-center text-truncate ${css({ fontSize: '0.75rem' })}`,
    column: css({ borderBottom: `1px solid ${colors.gray.dark}` })
}

const styles = {
    background: (changed: boolean) => (changed ? colors.yellow.light : colors.blue.light)
}

export const defaultParameters = {
    'show indices': { value: true, bool: true as const },
    'show values': { value: true, bool: true as const },
    'column width': { value: 35, range: [5, 100] as [number, number] },
    'column height': { value: 60, range: [5, 200] as [number, number] },
    'size mode': { value: 'delta', options: ['delta', 'step'] }
}

export const defaults: ReadonlySet<tracer.Obj['category']> = new Set()
export const supported: ReadonlySet<tracer.Obj['category']> = new Set(['list'])

export const Shape = (props: {
    id: string
    obj: tracer.Obj
    previousMembers: { [id: string]: tracer.Member }
    parameters: UnknownParameters
    onReference: (reference: { id: string; name: string; ref$: HTMLSpanElement; edge: Partial<Edge> }) => void
}) => {
    const parameters = readParameters(props.parameters, defaultParameters)
    const showIndices = parameters['show indices']
    const showValues = parameters['show values']
    const columnWidth = parameters['column width']
    const columnHeight = parameters['column height']
    const deltaMode = parameters['size mode']

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
        const name = getMemberName(member)
        const displayIndex = (member.key as number).toString()
        const displayValue = getDisplayValue(member.value, props.id)
        const changed = !isSameMember(member, props.previousMembers[name])

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
        <Base title={props.obj.type}>
            <div className={classes.container}>
                {!supported.has(props.obj.category)
                    ? 'incompatible'
                    : props.obj.members.length === 0
                    ? 'empty'
                    : props.obj.members.some(member => typeof member.value !== 'number' || !isFinite(member.value))
                    ? 'not a number'
                    : (() => {
                          const values = props.obj.members.map(member => member.value as number)
                          const ratios = deltaMode === 'delta' ? computeDeltaRatios(values) : computeStepRatios(values)
                          return props.obj.members.map((member, i) => renderColumn(member, ratios[i], i))
                      })()}
            </div>
        </Base>
    )
}
