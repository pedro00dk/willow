import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../../../colors'
import * as schema from '../../../../../schema/schema'
import { Base } from './Base'
import { Edge, readParameters, UnknownParameters } from '../../GraphData'
import { getDisplayValue, getMemberName, isSameMember, isValueObject } from '../../SchemaUtils'

const classes = {
    container: 'd-flex text-nowrap',
    chunk: 'd-flex',
    element: cn('d-flex px-1', css({ border: `0.5px solid ${colors.gray.dark}` })),
    index: cn('text-truncate mr-1', css({ fontSize: '0.5rem' })),
    value: cn('text-center text-truncate', css({ fontSize: '0.75rem' }))
}

const styles = {
    background: (changed: boolean) => (changed ? colors.yellow.light : colors.blue.light),
    color: (changed: boolean) => (changed ? colors.yellow.darker : colors.gray.dark)
}

export const defaultParameters = {
    'show indices': { value: true, bool: true as const },
    'cell width': { value: 35, range: [5, 100] as [number, number] },
    orientation: { value: 'horizontal', options: ['horizontal', 'vertical'] },
    'wrap array': { value: 'disabled', options: ['disabled', ...[...Array(21).keys()].map(i => (i + 1).toString())] },
    'wrap indices': { value: false, bool: true as const }
}

export const defaults: ReadonlySet<schema.Obj['gType']> = new Set(['array', 'linked', 'set'])
export const supported: ReadonlySet<schema.Obj['gType']> = new Set(['array', 'linked', 'set'])

export const Shape = (props: {
    id: string
    obj: schema.Obj
    previousMembers: { [id: string]: schema.Member }
    parameters: UnknownParameters
    onReference: (reference: { id: string; name: string; ref$: HTMLSpanElement; edge: Partial<Edge> }) => void
}) => {
    const parameters = readParameters(props.parameters, defaultParameters)
    const showIndices = parameters['show indices']
    const cellWidth = parameters['cell width']
    const orientation = parameters.orientation === 'horizontal' ? 'row' : 'column'
    const wrapArray = parseInt(parameters['wrap array']) || props.obj.members.length
    const wrapIndices = parameters['wrap indices']

    const chunks = props.obj.members.reduce((acc, member, i) => {
        const chunkIndex = Math.floor(i / wrapArray)
        const chunk = acc[chunkIndex] ?? (acc[chunkIndex] = [])
        chunk.push(member)
        return acc
    }, [] as schema.Member[][])

    const renderChunk = (chunk: schema.Member[], chunkIndex: number) => (
        <div key={chunkIndex} className={classes.chunk} style={{ flexDirection: orientation }}>
            {chunk.map((member, i) => renderCell(member, i))}
        </div>
    )

    const renderCell = (member: schema.Member, cellIndex: number) => {
        const name = getMemberName(member)
        const displayIndex = (wrapIndices ? cellIndex : (member.key as number)).toString()
        const displayValue = getDisplayValue(member.value, props.id)
        const isObject = isValueObject(member.value)
        const changed = !isSameMember(member, props.previousMembers[name])

        return (
            <div
                key={cellIndex}
                className={classes.element}
                style={{
                    background: styles.background(changed),
                    flexDirection: orientation === 'row' ? 'column' : 'row',
                    width: cellWidth
                }}
                title={displayValue}
            >
                {showIndices && <span className={classes.index}>{displayIndex}</span>}
                <span
                    ref={ref$ => {
                        if (!ref$ || !isObject) return
                        props.onReference({
                            id: (member.value as [string])[0],
                            name,
                            ref$,
                            edge: { color: styles.color(changed), text: displayIndex }
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
        <Base title={props.obj.lType}>
            <div className={classes.container} style={{ flexDirection: orientation === 'row' ? 'column' : 'row' }}>
                {!supported.has(props.obj.gType)
                    ? 'incompatible'
                    : props.obj.members.length === 0
                    ? 'empty'
                    : chunks.map((chunk, i) => renderChunk(chunk, i))}
            </div>
        </Base>
    )
}
