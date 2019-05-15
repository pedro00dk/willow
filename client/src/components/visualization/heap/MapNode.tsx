import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../colors'
import * as protocol from '../../../protobuf/protocol'
import { Obj } from '../../../reducers/tracer'
import { SquareBaseNode } from './BaseNode'
import { Link, Node } from './Heap'
import { RangeParameter } from './Parameters'

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

const getParameters = (node: Node) => {
    const parameters = node.parameters

    return {
        keyWidth: !!parameters && typeof parameters['keyWidth'] === 'number' ? (parameters['keyWidth'] as number) : 50,
        valueWidth:
            !!parameters && typeof parameters['valueWidth'] === 'number' ? (parameters['valueWidth'] as number) : 80
    }
}

export const isDefault = (obj: Obj) =>
    obj.type === protocol.Obj.Type.HMAP || obj.type === protocol.Obj.Type.TMAP || obj.type === protocol.Obj.Type.OTHER

export function Node(props: { obj: Obj; node: Node; link: Link }) {
    if (props.obj.members.length === 0)
        return (
            <SquareBaseNode obj={props.obj}>
                <div className={classes.elements}>empty</div>
            </SquareBaseNode>
        )

    const { keyWidth, valueWidth } = getParameters(props.node)

    return (
        <SquareBaseNode obj={props.obj}>
            <div className={classes.elements}>
                {props.obj.members.map((member, i) => {
                    const keyIsReference = typeof member.key === 'object'
                    const key = keyIsReference ? '::' : member.key
                    const valueIsReference = typeof member.value === 'object'
                    const value = valueIsReference ? '::' : member.value
                    return (
                        <div key={i} className={classes.element}>
                            <div
                                ref={ref => {
                                    if (!keyIsReference) return
                                    props.link.push({ ref, target: (member.key as Obj).reference, under: false })
                                }}
                                className={classes.key}
                                style={{ width: keyWidth }}
                                title={`${key}`}
                            >
                                {key}
                            </div>
                            <div
                                ref={ref => {
                                    if (!valueIsReference) return
                                    props.link.push({ ref, target: (member.value as Obj).reference, under: false })
                                }}
                                className={classes.value}
                                style={{ width: valueWidth }}
                                title={`${value}`}
                            >
                                {value}
                            </div>
                        </div>
                    )
                })}
            </div>
        </SquareBaseNode>
    )
}

export function Parameters(props: { obj: Obj; node: Node; onChange: () => void }) {
    const parameters = getParameters(props.node)

    return (
        <>
            <RangeParameter
                name={'key width'}
                value={parameters.keyWidth}
                interval={{ min: 10, max: 200 }}
                onChange={value => {
                    props.node.parameters.keyWidth = value
                    props.onChange()
                }}
            />
            <RangeParameter
                name={'value width'}
                value={parameters.valueWidth}
                interval={{ min: 10, max: 200 }}
                onChange={value => {
                    props.node.parameters.valueWidth = value
                    props.onChange()
                }}
            />
        </>
    )
}
