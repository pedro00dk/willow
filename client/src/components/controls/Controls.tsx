import React from 'react'
import { Language } from './Language'
import { Toolbar } from './Toolbar'

const classes = {
    container: 'd-flex shadow-sm p-2 mb-1',
    spacer: 'mx-2'
}

export const Controls = () => (
    <div className={classes.container}>
        <Language />
        <span className={classes.spacer} />
        <Toolbar />
    </div>
)
