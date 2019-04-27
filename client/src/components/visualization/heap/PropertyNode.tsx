import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { Item } from 'react-contexify'
import { colors } from '../../../colors'
import * as protocol from '../../../protobuf/protocol'
import { Obj } from '../../../reducers/visualization'
import { EllipsisBaseNode } from './BaseNode'

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

const getOptionsFromObject = (options: { [option: string]: unknown }) => ({
    memberKey:
        !!options && typeof options['memberKey'] !== 'object' ? (options['memberKey'] as string).toString() : '####'
})

export const isDefault = (obj: Obj) => false

// tslint:disable-next-line: variable-name
export const MemoNode = React.memo(Node)
export function Node(props: { obj: Obj; options?: { [option: string]: unknown } }) {
    if (props.obj.type === protocol.Obj.Type.SET)
        return (
            <EllipsisBaseNode obj={props.obj}>
                <div className={classes.elements}>incompatible</div>
            </EllipsisBaseNode>
        )

    const { memberKey } = getOptionsFromObject(props.options)

    if (memberKey == undefined || memberKey === '####')
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
    const value = typeof member.value === 'object' ? '::' : member.value

    return (
        <EllipsisBaseNode obj={props.obj}>
            <div className={classes.elements}>
                <div className={classes.element} title={`${value}`}>
                    {value}
                </div>
            </div>
        </EllipsisBaseNode>
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
                <span>key</span>
                <select
                    value={!!options.memberKey ? options.memberKey.toString() : '####'}
                    onChange={event => {
                        options.memberKey = event.target.value
                        props.onOptionsUpdate(options)
                    }}
                >
                    {props.obj.members
                        .filter(member => typeof member.key !== 'object')
                        .map(member => {
                            const keyString = member.key.toString()
                            return (
                                <option key={keyString} value={keyString}>
                                    {member.key}
                                </option>
                            )
                        })}
                    <option value='####'>unselect</option>
                </select>
            </Item>
        </>
    )
}
