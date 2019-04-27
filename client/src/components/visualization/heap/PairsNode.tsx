import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { Item } from 'react-contexify'
import { colors } from '../../../colors'
import * as protocol from '../../../protobuf/protocol'
import { Obj } from '../../../reducers/visualization'
import { SquareBaseNode } from './BaseNode'

const classes = {
    elements: cn('d-flex flex-column justify-content-center', 'text-nowrap'),
    element: cn(
        'd-inline-flex',
        css({
            cursor: 'default',
            fontSize: '1rem',
            background: colors.primaryBlue.light
        })
    ),
    key: cn(
        'text-truncate',
        css({
            borderLeft: `0.5px solid ${colors.gray.dark}`,
            borderTop: `0.5px solid ${colors.gray.dark}`,
            borderBottom: `0.5px solid ${colors.gray.dark}`,
            borderRight: `0.5px solid ${colors.gray.light}`,
            fontSize: '0.75rem'
        })
    ),
    value: cn(
        'text-center text-truncate',
        css({
            borderLeft: `0.5px solid ${colors.gray.light}`,
            borderTop: `0.5px solid ${colors.gray.dark}`,
            borderBottom: `0.5px solid ${colors.gray.dark}`,
            borderRight: `0.5px solid ${colors.gray.dark}`,
            fontSize: '0.75rem'
        })
    )
}

const getOptionsFromObject = (options: { [option: string]: unknown }) => ({
    keyWidth: !!options && typeof options['keyWidth'] === 'number' ? (options['keyWidth'] as number) : 50,
    valueWidth: !!options && typeof options['valueWidth'] === 'number' ? (options['valueWidth'] as number) : 80
})

export const isDefault = (obj: Obj) =>
    obj.type === protocol.Obj.Type.HMAP || obj.type === protocol.Obj.Type.TMAP || obj.type === protocol.Obj.Type.OTHER

// tslint:disable-next-line: variable-name
export const MemoNode = React.memo(Node)
export function Node(props: { obj: Obj; options?: { [option: string]: unknown } }) {
    if (props.obj.members.length === 0)
        return (
            <SquareBaseNode obj={props.obj}>
                <div className={classes.elements}>empty</div>
            </SquareBaseNode>
        )

    const { keyWidth, valueWidth } = getOptionsFromObject(props.options)

    return (
        <SquareBaseNode obj={props.obj}>
            <div className={classes.elements}>
                {props.obj.members.map((member, i) => {
                    const key = typeof member.key === 'object' ? '::' : member.key
                    const value = typeof member.value === 'object' ? '::' : member.value
                    return (
                        <div key={i} className={classes.element} title={`${key}`}>
                            <div className={classes.key} style={{ width: keyWidth }}>
                                {key}
                            </div>
                            <div className={classes.value} style={{ width: valueWidth }}>
                                {value}
                            </div>
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
                <span>key width</span>
                <input
                    type='range'
                    min={10}
                    value={options.keyWidth}
                    max={200}
                    onChange={event => {
                        options.keyWidth = event.target.valueAsNumber
                        props.onOptionsUpdate(options)
                    }}
                />
            </Item>
            <Item>
                <span>value width</span>
                <input
                    type='range'
                    min={10}
                    value={options.valueWidth}
                    max={200}
                    onChange={event => {
                        options.valueWidth = event.target.valueAsNumber
                        props.onOptionsUpdate(options)
                    }}
                />
            </Item>
        </>
    )
}
