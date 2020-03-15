import { css } from 'emotion'
import React from 'react'

const classes = {
    container: 'd-flex flex-column w-100 h-100',
    title: `text-secondary shadow-sm px-2 py-1 mb-1 ${css({ fontSize: '1rem' })}`,
    children: 'd-flex flex-fill'
}

export const Frame = (props: { title: string; children: React.ReactNode }) => (
    <div className={classes.container}>
        <span className={classes.title}>{props.title}</span>
        <div className={classes.children}>{props.children}</div>
    </div>
)
