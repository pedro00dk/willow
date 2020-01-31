import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import playImg from '../../../public/buttons/play.png'
import stepImg from '../../../public/buttons/stepInto.png'
import { useDispatch, useSelection } from '../../reducers/Store'
import { actions as tracerActions } from '../../reducers/tracer'

const classes = {
    container: 'd-flex align-items-center',
    image: cn('mx-3', css({ width: '1.5rem' }))
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
    const { canTrace, canStepBack, canStepForward } = useSelection(state => ({
        canTrace: !state.tracer.fetching,
        canStepBack: state.tracer.steps && state.tracer.index > 0,
        canStepForward: state.tracer.steps && state.tracer.index < state.tracer.steps.length - 1
    }))

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
        </div>
    )
}
