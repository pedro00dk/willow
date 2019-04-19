import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../../colors'
import * as protocol from '../../../../protobuf/protocol'
import { Obj } from '../../../../reducers/visualization'
import { BaseNode } from './BaseNode'

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

export const isSupported = (obj: Obj) =>
    obj.type === protocol.Obj.Type.ARRAY ||
    obj.type === protocol.Obj.Type.ALIST ||
    obj.type === protocol.Obj.Type.LLIST ||
    obj.type === protocol.Obj.Type.SET

export function Array(props: { obj: Obj; select: (reference: string) => void }) {
    if (!isSupported(props.obj))
        return (
            <BaseNode obj={props.obj} select={props.select}>
                <div className={classes.elements}>not compatible</div>
            </BaseNode>
        )

    if (props.obj.members.length === 0)
        return (
            <BaseNode obj={props.obj} select={props.select}>
                <div className={classes.elements}>empty</div>
            </BaseNode>
        )

    // parameters
    const showIndex = true
    const maxWidth = 50

    return (
        <BaseNode obj={props.obj} select={props.select}>
            <div className={classes.elements}>
                {props.obj.members.map((member, i) => (
                    <div key={i} className={classes.element} style={{ maxWidth }} title={`${member.value}`}>
                        {showIndex && <span className={classes.index}>{i}</span>}
                        <span className={classes.value}>{member.value}</span>
                    </div>
                ))}
            </div>
        </BaseNode>
    )
}
