import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import playImg from '../../public/buttons/play.png'
import restartImg from '../../public/buttons/restart.png'
import stepIntoImg from '../../public/buttons/stepInto.png'
import stepOutImg from '../../public/buttons/stepOut.png'
import stepOverImg from '../../public/buttons/stepOver.png'
import stopImg from '../../public/buttons/stop.png'
import { actions as debugActions } from '../reducers/debug'
import { AsyncAction, State, useDispatch, useRedux } from '../reducers/Store'
import { LanguageSelector } from './LanguageSelector'

const styles = {
    image: (available: boolean) =>
        cn(
            available ? css({ cursor: 'pointer' }) : css({ filter: 'grayscale(80%)' }),
            css({ height: '1.5rem', width: '1.5rem' }),
            'm-3'
        ),
    select: css({ flex: '0 1 auto !important', width: 'auto !important' }),
    input: css({ display: 'inline-flex !important', width: 'auto !important' })
}

export function Debugger() {
    const dispatch = useDispatch()
    const { debug } = useRedux(state => ({ debug: state.debug }))

    console.log(debug)

    React.useEffect(() => {
        if (debug.fetching || debug.responses.length === 0) return
        const lastResponse = debug.responses[debug.responses.length - 1]
        const lastEvent = lastResponse.events[lastResponse.events.length - 1]

        if (!!debug.error) afterError(dispatch)
        else if (debug.stopped) afterStop(dispatch)
        else if (!!lastEvent.started) afterStart(dispatch)
        else if (!!lastEvent.threw) afterThrew(dispatch)
        else if (!!lastEvent.locked) afterLocked(dispatch)
        else if (!!lastEvent.inspected && lastEvent.inspected.frame.finish) afterFinish(dispatch)
    }, [debug.error, debug.responses, debug.stopped])

    const availability = getAvailableActions(debug)
    return (
        <div className='d-flex flex-row align-items-center shadow-sm mb-1'>
            <LanguageSelector />
            <img
                className={styles.image(availability.start)}
                src={playImg}
                title={!debug.debugging ? 'start' : 'continue'}
                onClick={() => callStart(dispatch, debug)}
            />
            <img className={styles.image(false)} src={stepOverImg} title='step over' onClick={() => undefined} />
            <img className={styles.image(false)} src={stepIntoImg} title='step into' onClick={() => undefined} />
            <img className={styles.image(false)} src={stepOutImg} title='step out' onClick={() => undefined} />
            <img
                className={styles.image(availability.stop)}
                src={restartImg}
                title='restart'
                onClick={async () => {
                    await callStop(dispatch, debug)
                    await callStart(dispatch, debug)
                }}
            />
            <img
                className={styles.image(availability.stop)}
                src={stopImg}
                title='stop'
                onClick={() => callStop(dispatch, debug)}
            />
        </div>
    )
}

function getAvailableActions(debug: State['debug']) {
    return { start: !debug.fetching, step: debug.debugging && !debug.fetching, stop: debug.debugging }
}

function callStart(dispatch: Parameters<AsyncAction>[0], debug: State['debug']) {
    if (!getAvailableActions(debug).start) return
    dispatch(debugActions.start())
}

function callStop(dispatch: Parameters<AsyncAction>[0], debug: State['debug']) {
    if (!getAvailableActions(debug).stop) return
    dispatch(debugActions.stop())
}

async function afterStart(dispatch: Parameters<AsyncAction>[0]) {
    await dispatch(debugActions.input())
    await dispatch(debugActions.step('continue'))
    console.log('after start')
}

function afterThrew(dispatch: Parameters<AsyncAction>[0]) {
    //
    console.log('after threw')
}

async function afterLocked(dispatch: Parameters<AsyncAction>[0]) {
    await dispatch(debugActions.stop())
    console.log('after locked')
}

function afterFinish(dispatch: Parameters<AsyncAction>[0]) {
    //
    console.log('after finished')
}

function afterStop(dispatch: Parameters<AsyncAction>[0]) {
    //
    console.log('after stop')
}

function afterError(dispatch: Parameters<AsyncAction>[0]) {
    //
    console.log('after error')
}
