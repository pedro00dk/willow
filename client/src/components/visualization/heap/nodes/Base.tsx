import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../../colors'
import { Obj } from '../../../../reducers/visualization'

const classes = {
    container: cn('position-absolute', 'd-inline-flex flex-column', 'w-auto h-auto', 'p-1'),
    typeContainer: cn('px-1', css({ fontSize: '0.5rem' })),
    childrenContainer: cn(
        'd-flex flex-row justify-content-center',
        'rounded',
        'p-1',
        css({ background: colors.gray.light })
    )
}

export const name = 'base'

export const isDefault = (obj: Obj) => false

export const isSupported = (obj: Obj) => true

export function Node(props: { obj: Obj; select: (reference: string) => void; children?: React.ReactNode }) {
    return (
        <div
            className={classes.container}
            onClick={() => props.select(props.obj.reference)}
            onContextMenu={() => props.select(props.obj.reference)}
        >
            <div className={classes.typeContainer}>{props.obj.languageType}</div>
            <div className={classes.childrenContainer}>{props.children}</div>
        </div>
    )
}
