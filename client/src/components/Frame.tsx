import React from 'react'

const classes = {
    container: 'd-flex flex-column w-100 h-100',
    title: 'shadow-sm px-2 mb-1 h6',
    children: 'd-flex flex-fill'
}

export const Frame = (props: { title: string; children?: React.ReactNode }) => (
    <div className={classes.container}>
        <span className={classes.title}>{props.title}</span>
        <div className={classes.children}>{props.children}</div>
    </div>
)
