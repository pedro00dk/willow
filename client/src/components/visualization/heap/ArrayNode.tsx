import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
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

export const isDefault = (obj: Obj) => obj.type === protocol.Obj.Type.ARRAY || obj.type === protocol.Obj.Type.ALIST

export const isSupported = (obj: Obj) =>
    obj.type === protocol.Obj.Type.ARRAY ||
    obj.type === protocol.Obj.Type.ALIST ||
    obj.type === protocol.Obj.Type.LLIST ||
    obj.type === protocol.Obj.Type.SET

export function ArrayNode(props: { obj: Obj }) {
    if (!isSupported(props.obj))
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

    // parameters
    const showIndex = true
    const maxWidth = 50

    return (
        <SquareBaseNode obj={props.obj}>
            <div className={classes.elements}>
                {props.obj.members.map((member, i) => (
                    <div key={i} className={classes.element} style={{ maxWidth }} title={`${member.value}`}>
                        {showIndex && <span className={classes.index}>{i}</span>}
                        <span className={classes.value}>{member.value}</span>
                    </div>
                ))}
            </div>
        </SquareBaseNode>
    )
}
