import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import { useDispatch, useSelection } from '../../reducers/Store'
import { actions as tracerActions } from '../../reducers/tracer'

import playImg from '../../../public/buttons/play.png'
import stepImg from '../../../public/buttons/stepInto.png'

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
    const { tracer } = useSelection(state => ({ tracer: state.tracer }))

    return (
        <div className={classes.container}>
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
