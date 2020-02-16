import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import playImg from '../../../public/buttons/play.png'
import stepImg from '../../../public/buttons/stepInto.png'
import { useDispatch, useSelection } from '../../reducers/Store'
import { actions as optionsActions } from '../../reducers/options'
import { actions as tracerActions } from '../../reducers/tracer'

const classes = {
    container: 'd-flex align-items-center',
    image: cn('mx-3', css({ width: '1.5rem' })),
    span: 'mx-3'
}

const styles = {
    image: (available: boolean, rotation: number = 0) => ({
        cursor: available ? 'pointer' : undefined,
        filter: !available ? 'grayscale(100%)' : undefined,
        transform: `rotate(${rotation}deg)`
    })
}

export const Toolbar = () => {
    const dispatch = useDispatch()
    const { options, tracer } = useSelection(state => ({ options: state.options, tracer: state.tracer }))
    const canTrace = !tracer.fetching
    const canStepBack = tracer.steps && tracer.index > 0
    const canStepForward = tracer.steps && tracer.index < tracer.steps.length - 1
    const stepMessage = tracer.steps ? `Step ${tracer.index + 1} of ${tracer.steps.length}` : ''

    return (
        <div className={classes.container}>
            <img
                className={classes.image}
                style={styles.image(canTrace)}
                src={playImg}
                title='Start tracing'
                onClick={() => canTrace && dispatch(tracerActions.trace())}
            />
            <img
                className={classes.image}
                style={styles.image(canStepBack, 90)}
                src={stepImg}
                title='Step backward'
                onClick={() => canStepBack && dispatch(tracerActions.stepIndex('backward', 'into'))}
            />
            <img
                className={classes.image}
                style={styles.image(canStepForward, 270)}
                src={stepImg}
                title='Step forward'
                onClick={() => canStepForward && dispatch(tracerActions.stepIndex('forward', 'into'))}
            />
            <span className='ml-3 mr-1'>{'Live Programming'}</span>
            <input
                className='ml-1 mr-3'
                type='checkbox'
                checked={options.liveProgramming}
                onChange={event => dispatch(optionsActions.setLiveProgramming(event.target.checked))}
            />
            <span className='ml-3 mr-1'>{'Preserve Layout'}</span>
            <input
                className='ml-1 mr-3'
                type='checkbox'
                checked={options.preserveLayout}
                onChange={event => dispatch(optionsActions.setPreserveLayout(event.target.checked))}
            />
            <span className={classes.span}>{stepMessage}</span>
        </div>
    )
}
