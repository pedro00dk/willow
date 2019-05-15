import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../colors'
import * as protocol from '../../../protobuf/protocol'
import { Obj } from '../../../reducers/tracer'
import { EllipsisBaseNode } from './BaseNode'
import { Link, Node } from './Heap'
import { SelectParameter } from './Parameters'

const classes = {
    elements: cn('d-flex', 'text-nowrap'),
    element: cn(
        'd-inline-flex',
        'p-1',
        css({
            border: `0.5px solid ${colors.gray.dark}`,
            borderRadius: '50%',
            cursor: 'default',
            fontSize: '1rem',
            background: colors.primaryBlue.light
        })
    )
}

const getParameters = (node: Node) => {
    const parameters = node.parameters

    return {
        memberKey:
            !!parameters && parameters['memberKey'] != undefined && typeof parameters['memberKey'] !== 'object'
                ? (parameters['memberKey'] as string).toString()
                : '####'
    }
}

export const isDefault = (obj: Obj) => false

export function Node(props: { obj: Obj; node: Node; link: Link }) {
    if (props.obj.type === protocol.Obj.Type.SET)
        return (
            <EllipsisBaseNode obj={props.obj}>
                <div className={classes.elements}>incompatible</div>
            </EllipsisBaseNode>
        )

    const { memberKey } = getParameters(props.node)

    if (memberKey === '####')
        return (
            <EllipsisBaseNode obj={props.obj}>
                <div className={classes.elements}>choose</div>
            </EllipsisBaseNode>
        )

    const filteredMembers = props.obj.members //
        .filter(member => typeof member.key !== 'object' && member.key.toString() === memberKey)

    if (filteredMembers.length === 0)
        return (
            <EllipsisBaseNode obj={props.obj}>
                <div className={classes.elements}>not found</div>
            </EllipsisBaseNode>
        )
    if (filteredMembers.length > 1)
        return (
            <EllipsisBaseNode obj={props.obj}>
                <div className={classes.elements}>many found</div>
            </EllipsisBaseNode>
        )

    const member = filteredMembers[0]
    const isReference = typeof member.value === 'object'
    const value = isReference ? '::' : member.value

    const referenceMembers = [
        ...props.obj.members.filter(member => typeof member.key === 'object').map(member => member.key as Obj),
        ...props.obj.members
            .filter(member => typeof member.value === 'object' && member.key !== memberKey)
            .map(member => member.value as Obj)
    ]

    return (
        <EllipsisBaseNode obj={props.obj}>
            <div
                ref={ref =>
                    referenceMembers.forEach(obj => props.link.push({ ref, target: obj.reference, under: true }))
                }
                className={classes.elements}
            >
                <span
                    ref={ref => {
                        if (!isReference) return
                        props.link.push({ ref, target: (member.value as Obj).reference, under: false })
                    }}
                    className={classes.elements}
                    title={`${value}`}
                >
                    {value}
                </span>
            </div>
        </EllipsisBaseNode>
    )
}

export function Parameters(props: { obj: Obj; node: Node; onChange: () => void }) {
    const parameters = getParameters(props.node)

    return (
        <>
            <SelectParameter
                name={'key'}
                value={!!parameters.memberKey ? parameters.memberKey.toString() : '####'}
                options={[
                    '####',
                    ...props.obj.members
                        .filter(member => typeof member.key !== 'object')
                        .map(member => member.key.toString())
                ]}
                onChange={value => {
                    props.node.parameters.memberKey = value
                    props.onChange()
                }}
            />
        </>
    )
}
