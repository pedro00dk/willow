import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { Item } from 'react-contexify'
import { colors } from '../../../colors'
import * as protocol from '../../../protobuf/protocol'
import { Obj } from '../../../reducers/visualization'
import { SquareBaseNode } from './BaseNode'

const classes = {
    elements: cn('d-flex align-items-center'),
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
    value: cn('text-center text-truncate', css({ fontSize: '0.75rem' }))
}

const getOptionsFromObject = (options: { [option: string]: unknown }) => ({
    showIndex: !!options && typeof options['showIndex'] === 'boolean' ? (options['showIndex'] as boolean) : true,
    maxWidth: !!options && typeof options['maxWidth'] === 'number' ? (options['maxWidth'] as number) : 30
})

export const isDefault = (obj: Obj) => obj.type === protocol.Obj.Type.ARRAY || obj.type === protocol.Obj.Type.ALIST

export function Node(props: { obj: Obj; options?: { [option: string]: unknown } }) {
    if (
        props.obj.type !== protocol.Obj.Type.ARRAY &&
        props.obj.type !== protocol.Obj.Type.ALIST &&
        props.obj.type !== protocol.Obj.Type.LLIST &&
        props.obj.type !== protocol.Obj.Type.SET
    )
        return (
            <SquareBaseNode obj={props.obj}>
                <div className={classes.elements}>not compatible</div>
            </SquareBaseNode>
        )

    if (props.obj.members.length === 0)
        return (
            <SquareBaseNode obj={props.obj}>
                <div className={classes.elements}>empty</div>
            </SquareBaseNode>
        )

    const { showIndex, maxWidth } = getOptionsFromObject(props.options)

    return (
        <SquareBaseNode obj={props.obj}>
            <div className={classes.elements}>
                {props.obj.members.map((member, i) => {
                    const value = typeof member.value === 'object' ? '::' : member.value
                    return (
                        <div key={i} className={classes.element} style={{ maxWidth }} title={`${value}`}>
                            {showIndex && <span className={classes.index}>{i}</span>}
                            <span className={classes.value}>{value}</span>
                        </div>
                    )
                })}
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
                <span>max width</span>
                <input
                    type='range'
                    min={10}
                    value={options.maxWidth}
                    max={200}
                    onChange={event => {
                        options.maxWidth = event.target.valueAsNumber
                        props.onOptionsUpdate(options)
                    }}
                />
            </Item>
        </>
    )
}
