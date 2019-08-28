import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../colors'
import { ObjData } from '../../../reducers/tracer'

export const valueChanged = (previousMember: ObjData['members'][0], member: ObjData['members'][0]) => {
    if ((!previousMember && member) || (!member && previousMember)) return true
    if (!previousMember && !member) return false
    const previousValue = previousMember.value
    const value = member.value
    const isPrimitive = typeof value !== 'object'
    const previousIsPrimitive = typeof previousValue !== 'object'
    return (
        isPrimitive !== previousIsPrimitive ||
        (isPrimitive && value !== previousValue) ||
        (value as ObjData).id !== (previousValue as ObjData).id
    )
}

export const getDisplayValue = (memberKeyOrValue: ObjData['members'][0]['key'] | ObjData['members'][0]['value']) =>
    typeof memberKeyOrValue !== 'object' ? memberKeyOrValue.toString() : '::'

const classes = {
    container: cn('d-flex flex-column'),
    title: cn('px-1', css({ fontSize: '0.5rem' })),
    children: cn('d-flex flex-row justify-content-center', 'rounded', 'p-1', css({ background: colors.gray.light }))
}

export const Base = (props: { title: string; children?: React.ReactNode }) => (
    <div className={classes.container}>
        <span className={classes.title}>{props.title}</span>
        <div className={classes.children}>{props.children}</div>
    </div>
)
