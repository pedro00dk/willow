import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../colors'
import * as protocol from '../../../protobuf/protocol'
import { ObjNode } from '../../../reducers/debug/heap'
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

export function DefaultArray(props: { node: ObjNode }) {
    const supported =
        props.node.type === protocol.Obj.Type.ARRAY ||
        props.node.type === protocol.Obj.Type.ALIST ||
        props.node.type === protocol.Obj.Type.LLIST ||
        props.node.type === protocol.Obj.Type.SET

    if (!supported)
        return (
            <BaseNode type={props.node.languageType}>
                <div className={classes.elements}>not compatible</div>
            </BaseNode>
        )

    if (props.node.members.length === 0)
        return (
            <BaseNode type={props.node.languageType}>
                <div className={classes.elements}>empty</div>
            </BaseNode>
        )

    // parameters
    const showIndex = true
    const maxWidth = 50

    return (
        <BaseNode type={props.node.languageType}>
            <div className={classes.elements}>
                {props.node.members.map((member, i) => (
                    <div key={i} className={classes.element} style={{ maxWidth }} title={`${member.value}`}>
                        {showIndex && <span className={classes.index}>{i}</span>}
                        <span className={classes.value}>{member.value}</span>
                    </div>
                ))}
            </div>
        </BaseNode>
    )
}
