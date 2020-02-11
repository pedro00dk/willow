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
    container: 'd-flex text-nowrap',
    chunk: 'd-flex',
    element: cn('d-flex px-1', css({ border: `0.5px solid ${colors.gray.dark}` })),
    index: cn('text-truncate mr-1', css({ fontSize: '0.5rem' })),
    value: cn('text-center text-truncate', css({ fontSize: '0.75rem' }))
}

const styles = {
    background: (changed: boolean) => (changed ? colors.yellow.light : colors.blue.light),
    edge: (changed: boolean) => (changed ? colors.yellow.darker : undefined)
}

const defaultParameters = {
    'show indices': { value: true },
    'cell width': { value: 35, range: [5, 100] as [number, number] },
    orientation: { value: 'horizontal', options: ['horizontal', 'vertical'] },
    'wrap array': { value: 'disabled', options: ['disabled', ...[...Array(21).keys()].map(i => (i + 1).toString())] },
    'wrap indices': { value: false }
}

export const defaults: ReadonlySet<schema.Obj['gType']> = new Set(['array', 'linked', 'set'])
export const supported: ReadonlySet<schema.Obj['gType']> = new Set(['array', 'linked', 'set'])

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
    const showIndices = parameters['show indices']
    const cellWidth = parameters['cell width']
    const orientation = parameters.orientation === 'horizontal' ? 'row' : 'column'
    const wrapArray =
        parameters['wrap array'] === 'disabled' ? props.obj.members.length : parseInt(parameters['wrap array'])
    const wrapIndices = parameters['wrap indices']

    React.useEffect(() => {
        currentMembers.current = props.obj.members.reduce((acc, member) => {
            acc[getMemberName(member)] = member
            return acc
        }, {} as { [name: string]: schema.Member })
    })

    const chunks = props.obj.members.reduce((acc, member, i) => {
        const chunkIndex = Math.floor(i / wrapArray)
        const chunk = acc[chunkIndex] ?? (acc[chunkIndex] = [])
        chunk.push(member)
        return acc
    }, [] as schema.Member[][])

    const renderChunk = (chunk: schema.Member[], chunkIndex: number) => (
        <div key={chunkIndex} className={classes.chunk} style={{ flexDirection: orientation }}>
            {chunk.map((member, i) => renderCell(member, chunkIndex, i))}
        </div>
    )

    const renderCell = (member: schema.Member, chunkIndex: number, cellIndex: number) => {
        const displayIndex = wrapIndices ? cellIndex : (member.key as number)
        const displayValue = getDisplayValue(member.value, props.id)
        const isObject = isValueObject(member.value)
        const changed = !isSameMember(member, currentMembers.current[getMemberName(member)])

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
                        const targetId = (member.value as [string])[0]
                        props.onLink({ id: targetId, ref$, color: styles.edge(changed), text: displayIndex.toString() })
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
