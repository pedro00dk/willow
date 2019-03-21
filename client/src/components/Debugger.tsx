import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import playImg from '../../public/buttons/play.png'
import restartImg from '../../public/buttons/restart.png'
import stepIntoImg from '../../public/buttons/stepInto.png'
import stepOutImg from '../../public/buttons/stepOut.png'
import stepOverImg from '../../public/buttons/stepOver.png'
import stopImg from '../../public/buttons/stop.png'
import * as protocol from '../protobuf/protocol'
import { start, step, stop } from '../reducers/debug'
import { fetch } from '../reducers/language'
import { State, ThunkAction, useDispatch, useRedux } from '../reducers/Store'

const styles = {
    available: css({ cursor: 'pointer' }),
    disabled: css({ filter: 'grayscale(80%)' }),
    select: css({ flex: '0 1 auto !important', width: 'auto !important' }),
    input: css({ display: 'inline-flex !important', width: 'auto !important' })
}

export function Debugger() {
    const dispatch = useDispatch()
    const { debug, language } = useRedux(state => ({ debug: state.debug, language: state.language }))
    React.useEffect(() => {
        dispatch(fetch())
    }, [])
    useDebugUpdate(dispatch, debug)
    const availability = getAvailabilities(debug)
    return (
        <>
            <div className={cn('input-group ml-3', styles.input)}>
                <div className='input-group-prepend'>
                    <label className='input-group-text'>Lang</label>
                </div>
                <select
                    className={cn('custom-select', styles.select)}
                    disabled={debug.debugging}
                    defaultValue={language.selected}
                    onChange={event => dispatch({ type: 'language/select', payload: { selected: event.target.value } })}
                >
                    {language.languages.map((language, i) => (
                        <option key={i} value={language}>
                            {language}
                        </option>
                    ))}
                    {language.languages.length === 0 ? (
                        language.fetching ? (
                            <option key={-1} value='text'>
                                ...
                            </option>
                        ) : (
                            <option key={-1} value='text'>
                                !!!
                            </option>
                        )
                    ) : (
                        undefined
                    )}
                </select>
            </div>
            <div className={cn('input-group ml-3', styles.input)}>
                <div className='input-group-prepend'>
                    <label className='input-group-text'>Main</label>
                </div>
                <input
                    className={cn('form-control', styles.select)}
                    type='text'
                    disabled={debug.debugging}
                    placeholder='filename'
                    onBlur={event => dispatch({ type: 'code/setMain', payload: { main: event.target.value } })}
                />
            </div>
            <img
                className={cn('h-100', availability.start ? styles.available : styles.disabled)}
                src={playImg}
                title={!debug.debugging ? 'start' : 'continue'}
                onClick={() => onStart(dispatch, debug)}
            />
            <img
                className={cn('h-100', availability.step ? styles.available : styles.disabled)}
                src={stepOverImg}
                title='step over'
                onClick={() => onStep(dispatch, debug, 'stepOver')}
            />
            <img
                className={cn('h-100', availability.step ? styles.available : styles.disabled)}
                src={stepIntoImg}
                title='step into'
                onClick={() => onStep(dispatch, debug, 'step')}
            />
            <img
                className={cn('h-100', availability.step ? styles.available : styles.disabled)}
                src={stepOutImg}
                title='step out'
                onClick={() => onStep(dispatch, debug, 'stepOut')}
            />
            <img
                className={cn('h-100', availability.stop ? styles.available : styles.disabled)}
                src={restartImg}
                title='restart'
                onClick={async () => {
                    await onStop(dispatch, debug)
                    await onStart(dispatch, debug)
                }}
            />
            <img
                className={cn('h-100', availability.stop ? styles.available : styles.disabled)}
                src={stopImg}
                title='stop'
                onClick={() => (availability.stop ? dispatch(stop()) : undefined)}
            />
        </>
    )
}

function getAvailabilities(debug: State['debug']) {
    return { start: !debug.fetching, step: debug.debugging && !debug.fetching, stop: debug.debugging }
}

async function onStart(dispatch: Parameters<ThunkAction>[0], debug: State['debug']) {
    if (!getAvailabilities(debug).start) return
    if (!debug.debugging) {
        dispatch({ type: 'io/reset' })
        await dispatch(start())
    } else await step('continue')
}

async function onStop(dispatch: Parameters<ThunkAction>[0], debug: State['debug']) {
    if (!getAvailabilities(debug).stop) return
    await dispatch(stop())
}

async function onStep(dispatch: Parameters<ThunkAction>[0], debug: State['debug'], action: Parameters<typeof step>[0]) {
    if (!getAvailabilities(debug).step) return
    await dispatch(step(action))
}

function useDebugUpdate(dispatch: Parameters<ThunkAction>[0], debug: State['debug']) {
    const currentResponse = React.useRef(0)
    React.useEffect(() => {
        debug.responses
            .slice(currentResponse.current)
            .flatMap(response => response.events)
            .forEach(event => processEvent(dispatch, event))
        currentResponse.current = debug.responses.length - 1
    }, [debug])
}

function processEvent(dispatch: Parameters<ThunkAction>[0], event: protocol.Event) {
    if (!!event.threw)
        return dispatch({ type: 'io/appendOutput', payload: { output: event.threw.exception.traceback.join('') } })
    if (!!event.printed) return dispatch({ type: 'io/appendOutput', payload: { output: event.printed.value } })
}
