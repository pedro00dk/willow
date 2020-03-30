import React from 'react'
import { actions, useDispatch, useSelection } from '../../reducers/Store'

const classes = {
    container: 'd-flex align-items-center',
    option: 'custom-control custom-switch mx-3',
    optionInput: 'custom-control-input',
    optionLabel: 'custom-control-label'
}

export const Options = () => {
    const dispatch = useDispatch()
    const { visualization, preserveLayout } = useSelection(state => state.options)

    return (
        <div className={classes.container}>
            <div className={classes.option} title='Toggle visualization view'>
                <input
                    className={classes.optionInput}
                    type='checkbox'
                    id='visualization'
                    checked={visualization}
                    onChange={event => {
                        const enable = event.target.checked
                        dispatch(actions.options.setVisualization(enable))
                        dispatch(actions.user.action({ name: 'visualization', payload: enable }), false)
                    }}
                />
                <label className={classes.optionLabel} htmlFor='visualization'>
                    {'Visualization'}
                </label>
            </div>
            <div className={classes.option} title='Save the graph layout for the next trace'>
                <input
                    className={classes.optionInput}
                    type='checkbox'
                    id='preserveLayout'
                    checked={preserveLayout}
                    onChange={event => {
                        const enable = event.target.checked
                        dispatch(actions.options.setPreserveLayout(enable))
                        dispatch(actions.user.action({ name: 'preserve layout', payload: enable }), false)
                    }}
                />
                <label className={classes.optionLabel} htmlFor='preserveLayout'>
                    {'Preserve layout'}
                </label>
            </div>
        </div>
    )
}
