import React from 'react'
import { Language } from './Language'
import { Toolbar } from './Toolbar'

const classes = {
    container: 'd-flex align-items-center shadow-sm p-2 mb-1',
    split: 'px-2'
}

export const Controls = () => {
    return (
        <div className={classes.container}>
            <Language />
            <span className={classes.split}/>
            <Toolbar />
        </div>
    )
}
