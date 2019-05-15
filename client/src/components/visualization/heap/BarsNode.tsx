import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../colors'
import * as protocol from '../../../protobuf/protocol'
import { Obj } from '../../../reducers/tracer'
import { SquareBaseNode } from './BaseNode'
import { Link, Node } from './Heap'
import { BooleanParameter, RangeParameter, SelectParameter } from './Parameters'

const classes = {
    elements: cn('d-flex align-items-end', 'text-nowrap'),
    element: cn(
        'd-inline-flex flex-column',
        'px-1',
        css({
            border: `0.5px solid ${colors.gray.dark}`,
            cursor: 'default',
            fontSize: '1rem',
            background: colors.primaryBlue.light
        })
    ),
    index: cn('text-truncate', css({ fontSize: '0.5rem' })),
    value: cn('text-center text-truncate', css({ fontSize: '0.75rem' })),
    bar: cn(css({ borderBottom: `1px solid ${colors.gray.dark}` }))
}

const computeDeltaRatios = (values: number[]) => {
    const min = Math.min(...values)
    const max = Math.max(...values)
    const delta = max - min !== 0 ? max - min : 1
    return values.map(value => (value - min) / delta)
}

const computeFixedRatios = (values: number[]) => {
    const valuesIndices = values.map((value, i) => [value, i])
    valuesIndices.sort((a, b) => a[0] - b[0])
    const sequenceGenerator = { previous: -Infinity, sequence: 0 }
    const sequenceIndices = valuesIndices.map(([value, i]) => {
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

const modes = new Set(['delta', 'fixed'])

const getParameters = (node: Node) => {
    const parameters = node.parameters

    return {
        mode: !!parameters && modes.has(parameters['mode'] as string) ? (parameters['mode'] as string) : 'delta',
        showIndex:
            !!parameters && typeof parameters['showIndex'] === 'boolean' ? (parameters['showIndex'] as boolean) : true,
        showValues:
            !!parameters && typeof parameters['showValues'] === 'boolean'
                ? (parameters['showValues'] as boolean)
                : true,
        width: !!parameters && typeof parameters['width'] === 'number' ? (parameters['width'] as number) : 30,
        height: !!parameters && typeof parameters['height'] === 'number' ? (parameters['height'] as number) : 50
    }
}

export const isDefault = (obj: Obj) => false

export function Node(props: { obj: Obj; node: Node; link: Link }) {
    if (
        (props.obj.type !== protocol.Obj.Type.TUPLE &&
            props.obj.type !== protocol.Obj.Type.ARRAY &&
            props.obj.type !== protocol.Obj.Type.ALIST &&
            props.obj.type !== protocol.Obj.Type.LLIST &&
            props.obj.type !== protocol.Obj.Type.SET) ||
        props.obj.members.some(member => typeof member.value !== 'number' || !isFinite(member.value))
    )
        return (
            <SquareBaseNode obj={props.obj}>
                <div className={classes.elements}>incompatible</div>
            </SquareBaseNode>
        )

    if (props.obj.members.length === 0)
        return (
            <SquareBaseNode obj={props.obj}>
                <div className={classes.elements}>empty</div>
            </SquareBaseNode>
        )

    const { mode, showIndex, showValues, width, height } = getParameters(props.node)
    const values = props.obj.members.map(member => member.value as number)
    const ratios = mode === 'delta' ? computeDeltaRatios(values) : computeFixedRatios(values)

    return (
        <SquareBaseNode obj={props.obj}>
            <div className={classes.elements}>
                {ratios.map((ratio, i) => (
                    <div key={i} className={classes.element} style={{ width }} title={`${values[i]}`}>
                        <div className={classes.bar} style={{ height: `${ratio * height}px` }} />
                        {showIndex && <span className={classes.index}>{i}</span>}
                        {showValues && <span className={classes.value}>{values[i]}</span>}
                    </div>
                ))}
            </div>
        </SquareBaseNode>
    )
}

export function Parameters(props: { obj: Obj; node: Node; onChange: () => void }) {
    const parameters = getParameters(props.node)

    return (
        <>
            <SelectParameter
                name={'mode'}
                value={parameters.mode}
                options={[...modes]}
                onChange={value => {
                    props.node.parameters.mode = value
                    props.onChange()
                }}
            />
            <BooleanParameter
                name={'show index'}
                value={parameters.showIndex}
                onChange={value => {
                    props.node.parameters.showIndex = value
                    props.onChange()
                }}
            />
            <BooleanParameter
                name={'show values'}
                value={parameters.showValues}
                onChange={value => {
                    props.node.parameters.showValues = value
                    props.onChange()
                }}
            />
            <RangeParameter
                name={'width'}
                value={parameters.width}
                interval={{ min: 5, max: 100 }}
                onChange={value => {
                    props.node.parameters.width = value
                    props.onChange()
                }}
            />
            <RangeParameter
                name={'height'}
                value={parameters.height}
                interval={{ min: 5, max: 200 }}
                onChange={value => {
                    props.node.parameters.height = value
                    props.onChange()
                }}
            />
        </>
    )
}
