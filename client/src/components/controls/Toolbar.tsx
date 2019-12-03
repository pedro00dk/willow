import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import playImg from '../../../public/buttons/play.png'
import stepImg from '../../../public/buttons/stepInto.png'
import { useDispatch, useSelection } from '../../reducers/Store'
import { actions as tracerActions } from '../../reducers/tracer'

const classes = {
    container: 'd-flex align-items-center',
    image: cn('mx-3', css({ height: '1.5rem', width: '1.5rem' }))
}

const styles = {
    image: (available: boolean, rotation: number = 0) => ({
        transform: `rotate(${rotation}deg)`,
        ...(available ? { cursor: 'pointer' } : { filter: 'grayscale(100%)' })
    })
}

export const Toolbar = () => {
    const dispatch = useDispatch()
    const { traceAvailable, stepBackwardAvailable, stepForwardAvailable } = useSelection(state => ({
        traceAvailable: !state.tracer.fetching,
        stepBackwardAvailable: state.tracer.steps && state.tracer.index > 0,
        stepForwardAvailable: state.tracer.steps && state.tracer.index < state.tracer.steps.length - 1
    }))

    return (
        <div className={classes.container}>
            <img
                className={classes.image}
                style={styles.image(traceAvailable)}
                src={playImg}
                title={'trace'}
                onClick={() => traceAvailable && dispatch(tracerActions.trace())}
            />
            <img
                className={classes.image}
                style={styles.image(stepBackwardAvailable, 90)}
                src={stepImg}
                title='step backward'
                onClick={() => stepBackwardAvailable && dispatch(tracerActions.stepIndex('backward', 'into'))}
            />
            <img
                className={classes.image}
                style={styles.image(stepForwardAvailable, 270)}
                src={stepImg}
                title='step forward'
                onClick={() => stepForwardAvailable && dispatch(tracerActions.stepIndex('forward', 'into'))}
            />
        </div>
    )
}
