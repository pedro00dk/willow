import React from 'react'
import { DefaultStore } from '../reducers/Store'
import { Body } from './Body'
import { Header } from './Header'

const classes = {
    container: 'd-flex flex-column vw-100 vh-100'
}

export const App = () => (
    <DefaultStore>
        <div className={classes.container}>
            <Header />
            <Body />
        </div>
    </DefaultStore>
)
