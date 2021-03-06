import { css } from 'emotion'
import React from 'react'
import playImage from '../../../public/buttons/play.png'
import stepImage from '../../../public/buttons/stepInto.png'
import { actions, useDispatch, useSelection } from '../../reducers/Store'

const classes = {
    container: 'd-flex align-items-center',
    image: `mx-3 ${css({ width: '1.5rem' })}`,
    label: 'mx-3',
    spinner: 'spinner-border text-secondary'
}

const styles = {
    image: (available: boolean, rotation: number = 0) => ({
        cursor: available && 'pointer',
        filter: !available && 'grayscale(100%)',
        transform: `rotate(${rotation}deg)`
    })
}

export const Tracer = () => {
    const dispatch = useDispatch()
    const { index, tracer } = useSelection(state => ({ index: state.index, tracer: state.tracer }))
    const canTrace = !tracer.fetching
    const canStepBack = tracer.available && index > 0
    const canStepForward = tracer.available && index < tracer.steps.length - 1
    const phase = tracer.status.phase === 'upload' ? 'requesting' : 'fetching'
    const percent = Math.round(tracer.status.progress * 100)
    const status = `${phase} ${percent}%`
    const step = tracer.available && `Step ${index + 1} of ${tracer.steps.length}`

    return (
        <div className={classes.container}>
            <img
                className={classes.image}
                style={styles.image(canTrace)}
                src={playImage}
                title='Start tracing'
                onClick={() => {
                    if (!canTrace) return
                    dispatch(actions.tracer.trace())
                }}
            />
            <img
                className={classes.image}
                style={styles.image(canStepBack, 90)}
                src={stepImage}
                title='Step backward'
                onClick={() => {
                    if (!canStepBack) return
                    dispatch(actions.index.step('<-', 'v'))
                    dispatch(actions.user.action({ name: 'step backward', payload: { index, using: 'toolbar' } }))
                }}
            />
            <img
                className={classes.image}
                style={styles.image(canStepForward, 270)}
                src={stepImage}
                title='Step forward'
                onClick={() => {
                    if (!canStepForward) return
                    dispatch(actions.index.step('->', 'v'))
                    dispatch(actions.user.action({ name: 'step forward', payload: { index, using: 'toolbar' } }))
                }}
            />
            {tracer.fetching && (
                <>
                    <div className={classes.spinner} role='status' />
                    <span className={classes.label}>{status}</span>
                </>
            )}
            {tracer.available && <span className={classes.label}>{step}</span>}
        </div>
    )
}
