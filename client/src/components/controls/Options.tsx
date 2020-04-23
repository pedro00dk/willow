import React from 'react'
import { actions, useDispatch, useSelection } from '../../reducers/Store'

const classes = {
    container: 'd-flex align-items-center',
    toggle: 'custom-control custom-switch mx-3',
    toggleInput: 'custom-control-input',
    toggleLabel: 'custom-control-label'
}

export const Options = () => {
    const dispatch = useDispatch()
    const { visualization, preserveLayout, reapplyLayout } = useSelection(state => state.options)

    return (
        <div className={classes.container}>
            <div className={classes.toggle} title='Toggle visualization view'>
                <input
                    className={classes.toggleInput}
                    type='checkbox'
                    id='visualization'
                    checked={visualization}
                    onChange={event => {
                        const enable = event.target.checked
                        dispatch(actions.options.setVisualization(enable))
                        dispatch(actions.user.action({ name: 'visualization', payload: enable }), false)
                    }}
                />
                <label className={classes.toggleLabel} htmlFor='visualization'>
                    {'Visualization'}
                </label>
            </div>
            <div className={classes.toggle} title='Save the graph layout for the next trace'>
                <input
                    className={classes.toggleInput}
                    type='checkbox'
                    id='preserveLayout'
                    checked={preserveLayout}
                    onChange={event => {
                        const enable = event.target.checked
                        dispatch(actions.options.setPreserveLayout(enable))
                        dispatch(actions.user.action({ name: 'preserve layout', payload: enable }), false)
                    }}
                />
                <label className={classes.toggleLabel} htmlFor='preserveLayout'>
                    {'Preserve layout'}
                </label>
            </div>
            <div className={classes.toggle} title='Re-apply object layouts in double clicked nodes'>
                <input
                    className={classes.toggleInput}
                    type='checkbox'
                    id='reapplyLayout'
                    checked={reapplyLayout}
                    onChange={event => {
                        const enable = event.target.checked
                        dispatch(actions.options.setReapplyLayout(enable))
                        dispatch(actions.user.action({ name: 'reapply layout', payload: enable }), false)
                    }}
                />
                <label className={classes.toggleLabel} htmlFor='reapplyLayout'>
                    {'Re-apply layout'}
                </label>
            </div>
        </div>
    )
}
