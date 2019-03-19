import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import playImg from '../../public/buttons/play.png'
import restartImg from '../../public/buttons/restart.png'
import stepIntoImg from '../../public/buttons/stepInto.png'
import stepOutImg from '../../public/buttons/stepOut.png'
import stepOverImg from '../../public/buttons/stepOver.png'
import stopImg from '../../public/buttons/stop.png'
import { start, step, stop } from '../reducers/debug'
import { useDispatch, useRedux } from '../reducers/Store'

const styles = {
    available: css({ cursor: 'pointer' }),
    disabled: css({ filter: 'grayscale(80%)' })
}

export function Debugger() {
    const dispatch = useDispatch()
    const { debug } = useRedux(state => ({ debug: state.debug }))
    const available = {
        start: !debug.fetching,
        step: debug.debugging && !debug.fetching,
        stop: debug.debugging
    }
    return (
        <>
            <img
                className={cn('h-100', available.start ? styles.available : styles.disabled)}
                src={playImg}
                title={!debug.debugging ? 'start' : 'continue'}
                onClick={() =>
                    available.start ? (!debug.debugging ? dispatch(start()) : dispatch(step('continue'))) : undefined
                }
            />
            <img
                className={cn('h-100', available.step ? styles.available : styles.disabled)}
                src={stepOverImg}
                title='step over'
                onClick={() => (available.step ? dispatch(step('stepOver')) : undefined)}
            />
            <img
                className={cn('h-100', available.step ? styles.available : styles.disabled)}
                src={stepIntoImg}
                title='step into'
                onClick={() => (available.step ? dispatch(step('step')) : undefined)}
            />
            <img
                className={cn('h-100', available.step ? styles.available : styles.disabled)}
                src={stepOutImg}
                title='step out'
                onClick={() => (available.step ? dispatch(step('stepOut')) : undefined)}
            />
            <img
                className={cn('h-100', available.stop ? styles.available : styles.disabled)}
                src={restartImg}
                title='restart'
                onClick={async () => {
                    if (!available.stop) return
                    await dispatch(stop())
                    dispatch(start())
                }}
            />
            <img
                className={cn('h-100', available.stop ? styles.available : styles.disabled)}
                src={stopImg}
                title='stop'
                onClick={() => (available.stop ? dispatch(stop()) : undefined)}
            />
        </>
    )
}
