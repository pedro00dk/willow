import React from 'react'
import { actions, DefaultStore, useDispatch } from '../reducers/Store'
import { Body } from './Body'
import { Header } from './Header'

const classes = {
    container: 'd-flex flex-column vw-100 vh-100'
}

export const App = () => {
    const dispatch = useDispatch()

    React.useEffect(() => {
        ;(async () => {
            await dispatch(actions.user.fetch())
            await dispatch(actions.language.fetch())
            await dispatch(actions.storage.storage())
        })()
    })

    return (
        <DefaultStore>
            <div className={classes.container}>
                <Header />
                <Body />
            </div>
        </DefaultStore>
    )
}
