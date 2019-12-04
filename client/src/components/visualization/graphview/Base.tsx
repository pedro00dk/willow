import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../colors'
import * as schema from '../../../schema/schema'

export const memberChanged = (currentMember: schema.Member, member: schema.Member) => {
    if ((!currentMember && member) || (!member && currentMember)) return true
    if (!currentMember && !member) return false
    return valueChanged(currentMember.value, member.value)
}

export const valueChanged = (currentValue: schema.Value, value: schema.Value) => {
    const isPrimitive = typeof value !== 'object'
    const previousIsPrimitive = typeof currentValue !== 'object'
    return (
        isPrimitive !== previousIsPrimitive ||
        (isPrimitive && value !== currentValue) ||
        (value as [string])[0] !== (currentValue as [string])[0]
    )
}

export const getDisplayValue = (id: string, value: schema.Value) =>
    typeof value !== 'object' ? value.toString() : (value as [string])[0] === id ? ':#:' : '::'

const classes = {
    container: 'd-flex flex-column',
    title: cn('px-1', css({ fontSize: '0.5rem' })),
    children: cn('d-flex justify-content-center rounded p-1', css({ background: colors.gray.light }))
}

export const Base = (props: { title: string; children?: React.ReactNode }) => (
    <div className={classes.container}>
        <span className={classes.title}>{props.title}</span>
        <div className={classes.children}>{props.children}</div>
    </div>
)
