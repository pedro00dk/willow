import React from 'react'
import { Language } from './Language'
import { Options } from './Options'
import { Tracer } from './Tracer'

const classes = {
    container: 'd-flex shadow-sm p-2 mb-1',
    splitter: 'mx-2',
    spacer: 'mx-auto'
}

export const Controls = () => (
    <div className={classes.container}>
        <Language />
        <span className={classes.splitter} />
        <Tracer />
        <span className={classes.spacer} />
        <Options />
    </div>
)
