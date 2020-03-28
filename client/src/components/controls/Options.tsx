import React from 'react'
import { actions, useDispatch, useSelection } from '../../reducers/Store'

const classes = {
    container: 'd-flex align-items-center',
    option: 'mx-3',
    optionLabel: 'mr-2'
}

export const Options = () => {
    const dispatch = useDispatch()
    const { enableVisualization, preserveLayout } = useSelection(state => ({ ...state.options }))

    return (
        <div className={classes.container}>
            <div className={classes.option}>
                <span className={classes.optionLabel}>{'Enable visualization'}</span>
                <input
                    type='checkbox'
                    checked={enableVisualization}
                    onChange={event => {
                        const enable = event.target.checked
                        dispatch(actions.options.setEnableVisualization(enable))
                        dispatch(actions.user.action({ name: 'enable visualization', payload: enable }), false)
                    }}
                />
            </div>
            <div className={classes.option}>
                <span className={classes.optionLabel}>{'Preserve Layout'}</span>
                <input
                    type='checkbox'
                    checked={preserveLayout}
                    onChange={event => {
                        const enable = event.target.checked
                        dispatch(actions.options.setPreserveLayout(enable))
                        dispatch(actions.user.action({ name: 'preserve layout', payload: enable }), false)
                    }}
                />
            </div>
        </div>
    )
}
