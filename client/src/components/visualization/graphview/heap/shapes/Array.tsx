import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../../../colors'
import * as tracer from '../../../../../types/tracer'
import { ComputedParameters, Edge, Node } from '../../Graph'
import { getValueDisplay, getValueString, isSameMember, isValueReference } from '../../TracerUtils'

const classes = {
    container: 'd-flex text-nowrap',
    chunk: 'd-flex',
    element: `d-flex px-1 ${css({ border: `0.5px solid ${colors.gray.dark}` })}`,
    index: `text-truncate mr-1 ${css({ fontSize: '0.5rem' })}`,
    value: `text-center text-truncate ${css({ fontSize: '0.75rem' })}`
}

const styles = {
    cellColor: (changed: boolean) => (changed ? colors.yellow.lighter : colors.blue.lighter),
    edgeColor: (changed: boolean) => (changed ? colors.yellow.darker : colors.blue.main)
}

export const defaultParameters = {
    'show indices': { value: true, bool: true as const },
    'cell width': { value: 35, range: [5, 100] as [number, number], tick: 5 },
    orientation: { value: 'horizontal', options: ['horizontal', 'vertical'] },
    'wrap array': { value: 'disabled', options: ['disabled', ...[...Array(21).keys()].map(i => (i + 1).toString())] },
    'wrap indices': { value: false, bool: true as const }
}

export const defaults: ReadonlySet<tracer.Obj['category']> = new Set(['list', 'set'])
export const supported: ReadonlySet<tracer.Obj['category']> = new Set(['list', 'set'])

export const Shape = (props: {
    id: string
    obj: tracer.Obj
    node: Node
    previousMembers: { [id: string]: tracer.Member }
    parameters: ComputedParameters<typeof defaultParameters>
    onReference: (reference: { key: string; target: string; ref$: HTMLSpanElement; edge: Partial<Edge> }) => void
}) => {
    const showIndices = props.parameters['show indices']
    const cellWidth = props.parameters['cell width']
    const orientation = props.parameters.orientation === 'horizontal' ? 'row' : 'column'
    const wrapArray = parseInt(props.parameters['wrap array']) || props.obj.members.length
    const wrapIndices = props.parameters['wrap indices']

    const chunks = props.obj.members.reduce((acc, member, i) => {
        const chunkIndex = Math.floor(i / wrapArray)
        const chunk = acc[chunkIndex] ?? (acc[chunkIndex] = [])
        chunk.push(member)
        return acc
    }, [] as tracer.Member[][])

    const renderChunk = (chunk: tracer.Member[], chunkIndex: number) => (
        <div key={chunkIndex} className={classes.chunk} style={{ flexDirection: orientation }}>
            {chunk.map((member, i) => renderCell(member, i))}
        </div>
    )

    const renderCell = (member: tracer.Member, cellIndex: number) => {
        const key = getValueString(member.key)
        const displayIndex = wrapIndices ? cellIndex.toString() : getValueDisplay(member.key)
        const displayValue = getValueDisplay(member.value, props.id)
        const isReference = isValueReference(member.value)
        const changed = !isSameMember(member, props.previousMembers[key])

        return (
            <div
                key={cellIndex}
                className={classes.element}
                style={{
                    background: styles.cellColor(changed),
                    flexDirection: orientation === 'row' ? 'column' : 'row',
                    width: cellWidth
                }}
                title={displayValue}
            >
                {showIndices && <span className={classes.index}>{displayIndex}</span>}
                <span
                    ref={ref$ => {
                        if (!ref$ || !isReference) return
                        props.onReference({
                            key,
                            target: getValueString(member.value),
                            ref$,
                            edge: { color: styles.edgeColor(changed), text: displayIndex }
                        })
                    }}
                    className={classes.value}
                >
                    {displayValue}
                </span>
            </div>
        )
    }

    return (
        <div className={classes.container} style={{ flexDirection: orientation === 'row' ? 'column' : 'row' }}>
            {!supported.has(props.obj.category) ? (
                <span title={'Object type not supported by shape'}>{'error'}</span>
            ) : props.obj.members.length === 0 ? (
                <span title={'Object is empty'}>{'[ ]'}</span>
            ) : (
                chunks.map((chunk, i) => renderChunk(chunk, i))
            )}
        </div>
    )
}
