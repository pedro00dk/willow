import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../colors'
import { Obj } from '../../../reducers/tracer'

const classes = {
    square: {
        container: cn('d-inline-flex flex-column', 'w-auto h-auto'),
        type: cn('px-1', css({ fontSize: '0.5rem' })),
        children: cn('d-flex flex-row justify-content-center', 'rounded', 'p-1', css({ background: colors.gray.light }))
    },
    ellipsis: {
        container: cn('d-inline-flex flex-column justify-content-center', 'w-auto h-auto', 'p-1'),
        type: cn('text-center', 'px-1', css({ fontSize: '0.5rem' })),
        children: cn(
            'd-flex flex-row justify-content-center',
            'p-1',
            css({ background: colors.gray.light, borderRadius: '50%' })
        )
    }
}

// tslint:disable-next-line: variable-name
export const MemoSquareBaseNode = React.memo(SquareBaseNode)
export function SquareBaseNode(props: { obj: Obj; children?: React.ReactNode; [props: string]: unknown }) {
    return (
        <div className={classes.square.container}>
            <span className={classes.square.type}>{props.obj.languageType}</span>
            <div className={classes.square.children}>{props.children}</div>
        </div>
    )
}

// tslint:disable-next-line: variable-name
export const MemoEllipsisBaseNode = React.memo(EllipsisBaseNode)
export function EllipsisBaseNode(props: { obj: Obj; children?: React.ReactNode; [props: string]: unknown }) {
    return (
        <div className={classes.ellipsis.container}>
            <span className={classes.ellipsis.type}>{props.obj.languageType}</span>
            <div className={classes.ellipsis.children}>{props.children}</div>
        </div>
    )
}
