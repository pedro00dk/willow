import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../colors'

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

export function BaseNode(props: { type: string; children?: React.ReactNode }) {
    return (
        <div className={classes.container}>
            <div className={classes.typeContainer}>{props.type}</div>
            <div className={classes.childrenContainer}>{props.children}</div>
        </div>
    )
}
