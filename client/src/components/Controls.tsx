import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import playImg from '../../public/buttons/play.png'
import stepImg from '../../public/buttons/stepInto.png'
import { useDispatch, useRedux } from '../reducers/Store'
import { actions as tracerActions } from '../reducers/tracer'
import { Languages } from './Languages'

const classes = {
    container: cn('d-flex flex-row align-items-center', 'shadow-sm'),
    image: cn('m-3', css({ height: '1.5rem', width: '1.5rem' }))
}

const styles = {
    image: (available: boolean, rotation: number = 0) => ({
        transform: `rotate(${rotation}deg)`,
        ...(available ? { cursor: 'pointer' } : { filter: 'grayscale(100%)' })
    })
}

export function Controls() {
    const dispatch = useDispatch()
    const { tracer } = useRedux(state => ({ tracer: state.tracer }))

    return (
        <div className={classes.container}>
            <Languages />
            <img
                className={classes.image}
                style={styles.image(!tracer.fetching)}
                src={playImg}
                title={'trace'}
                onClick={() => dispatch(tracerActions.trace())}
            />
            <img
                className={classes.image}
                style={styles.image(tracer.available && tracer.index > 0, 90)}
                src={stepImg}
                title='step back'
                onClick={() => dispatch(tracerActions.setIndex(tracer.index - 1))}
            />
            <img
                className={classes.image}
                style={styles.image(tracer.available && tracer.index < tracer.steps.length - 1, -90)}
                src={stepImg}
                title='step forward'
                onClick={() => dispatch(tracerActions.setIndex(tracer.index + 1))}
            />
        </div>
    )
}
