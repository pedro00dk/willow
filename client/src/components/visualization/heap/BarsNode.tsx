import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { Item } from 'react-contexify'
import { colors } from '../../../colors'
import * as protocol from '../../../protobuf/protocol'
import { Obj } from '../../../reducers/visualization'
import { SquareBaseNode } from './BaseNode'

const classes = {
    elements: cn('d-flex align-items-end'),
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

const getOptionsFromObject = (options: { [option: string]: unknown }) => ({
    mode: !!options && typeof modes.has(options['mode'] as string) ? (options['mode'] as string) : 'delta',
    showIndex: !!options && typeof options['showIndex'] === 'boolean' ? (options['showIndex'] as boolean) : true,
    showValues: !!options && typeof options['showValues'] === 'boolean' ? (options['showValues'] as boolean) : true,
    width: !!options && typeof options['width'] === 'number' ? (options['width'] as number) : 30,
    height: !!options && typeof options['height'] === 'number' ? (options['height'] as number) : 50
})

export const isDefault = (obj: Obj) => false

export function Node(props: { obj: Obj; options?: { [option: string]: unknown } }) {
    if (
        (props.obj.type !== protocol.Obj.Type.ARRAY &&
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

    const { mode, showIndex, showValues, width, height } = getOptionsFromObject(props.options)

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

export function NodeOptions(props: {
    obj: Obj
    options: { [option: string]: unknown }
    onOptionsUpdate: (options: { [option: string]: unknown }) => void
}) {
    const options = getOptionsFromObject(props.options)

    return (
        <>
            <Item>
                <span>mode</span>
                <select
                    value={options.mode}
                    onChange={event => {
                        options.mode = event.target.value
                        props.onOptionsUpdate(options)
                    }}
                >
                    <option value='delta'>delta</option>
                    <option value='fixed'>fixed</option>
                </select>
            </Item>
            <Item>
                <span>show index</span>
                <input
                    type='checkbox'
                    checked={options.showIndex}
                    onChange={event => {
                        options.showIndex = event.target.checked
                        props.onOptionsUpdate(options)
                    }}
                />
            </Item>
            <Item>
                <span>show values</span>
                <input
                    type='checkbox'
                    checked={options.showValues}
                    onChange={event => {
                        options.showValues = event.target.checked
                        props.onOptionsUpdate(options)
                    }}
                />
            </Item>
            <Item>
                <span>width</span>
                <input
                    type='range'
                    min={5}
                    value={options.width}
                    max={100}
                    onChange={event => {
                        options.width = event.target.valueAsNumber
                        props.onOptionsUpdate(options)
                    }}
                />
            </Item>
            <Item>
                <span>height</span>
                <input
                    type='range'
                    min={5}
                    value={options.height}
                    max={200}
                    onChange={event => {
                        options.height = event.target.valueAsNumber
                        props.onOptionsUpdate(options)
                    }}
                />
            </Item>
        </>
    )
}
