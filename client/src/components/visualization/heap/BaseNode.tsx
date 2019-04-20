import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../colors'
import { Obj } from '../../../reducers/visualization'

const classes = {
    square: {
        container: cn('d-inline-flex flex-column', 'w-auto h-auto', 'p-1'),
        type: cn('px-1', css({ fontSize: '0.5rem' })),
        children: cn('d-flex flex-row justify-content-center', 'rounded', 'p-1', css({ background: colors.gray.light }))
    },
    cylinder: {
        container: cn('d-inline-flex flex-column justify-content-center', 'w-auto h-auto', 'p-1'),
        type: cn('px-1', css({ fontSize: '0.5rem' })),
        children: cn(
            'd-flex flex-row justify-content-center',
            'p-1',
            css({ background: colors.gray.light, borderRadius: '50%' })
        )
    }
}

export function SquareBaseNode(props: { obj: Obj; children?: React.ReactNode }) {
    return (
        <div className={classes.square.container}>
            <span className={classes.square.type}>{props.obj.languageType}</span>
            <div className={classes.square.children}>{props.children}</div>
        </div>
    )
}

export function CylinderBaseNode(props: { obj: Obj; children?: React.ReactNode }) {
    return (
        <div className={classes.cylinder.container}>
            <div className={classes.cylinder.type}>{props.obj.languageType}</div>
            <div className={classes.cylinder.children}>{props.children}</div>
        </div>
    )
}
