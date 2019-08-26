import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../colors'

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
