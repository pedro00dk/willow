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
import { actions as debugActions } from '../reducers/debug'
import { actions as markerActions, MarkerType } from '../reducers/marker'
import { AsyncAction, State, useDispatch, useRedux } from '../reducers/Store'
import { LanguageSelector } from './LanguageSelector'

const styles = {
    available: css({ cursor: 'pointer' }),
    disabled: css({ filter: 'grayscale(80%)' }),
    select: css({ flex: '0 1 auto !important', width: 'auto !important' }),
    input: css({ display: 'inline-flex !important', width: 'auto !important' })
}

export function Debugger() {
    const dispatch = useDispatch()
    const { debug } = useRedux(state => ({ debug: state.debug }))

    useDebugUpdate(dispatch, debug)

    const availability = getAvailableActions(debug)
    return (
        <>
            <LanguageSelector />
            <img
                className={cn('h-100', availability.start ? styles.available : styles.disabled)}
                src={playImg}
                title={!debug.debugging ? 'start' : 'continue'}
                onClick={() => callStart(dispatch, debug)}
            />
            <img
                className={cn('h-100', availability.step ? styles.available : styles.disabled)}
                src={stepOverImg}
                title='step over'
                onClick={() => callStep(dispatch, debug, 'stepOver')}
            />
            <img
                className={cn('h-100', availability.step ? styles.available : styles.disabled)}
                src={stepIntoImg}
                title='step into'
                onClick={() => callStep(dispatch, debug, 'step')}
            />
            <img
                className={cn('h-100', availability.step ? styles.available : styles.disabled)}
                src={stepOutImg}
                title='step out'
                onClick={() => callStep(dispatch, debug, 'stepOut')}
            />
            <img
                className={cn('h-100', availability.stop ? styles.available : styles.disabled)}
                src={restartImg}
                title='restart'
                onClick={async () => {
                    await callStop(dispatch, debug)
                    await callStart(dispatch, debug)
                }}
            />
            <img
                className={cn('h-100', availability.stop ? styles.available : styles.disabled)}
                src={stopImg}
                title='stop'
                onClick={() => callStop(dispatch, debug)}
            />
        </>
    )
}

function getAvailableActions(debug: State['debug']) {
    return { start: !debug.fetching, step: debug.debugging && !debug.fetching, stop: debug.debugging }
}

async function callStart(dispatch: Parameters<AsyncAction>[0], debug: State['debug']) {
    if (!getAvailableActions(debug).start) return
    if (!debug.debugging) await dispatch(debugActions.start())
    else await dispatch(debugActions.step('continue'))
}

async function callStop(dispatch: Parameters<AsyncAction>[0], debug: State['debug']) {
    if (!getAvailableActions(debug).stop) return
    await dispatch(debugActions.stop())
}

async function callStep(
    dispatch: Parameters<AsyncAction>[0],
    debug: State['debug'],
    action: Parameters<typeof debugActions.step>[0]
) {
    if (!getAvailableActions(debug).step) return
    await dispatch(debugActions.step(action))
}

function useDebugUpdate(dispatch: Parameters<AsyncAction>[0], debug: State['debug']) {
    const currentResponse = React.useRef(0)
    React.useEffect(() => {
        if (!debug.debugging || debug.fetching) return
        if (debug.debugging && debug.responses.length === 0) currentResponse.current = 0
        console.log(debug.responses)
        console.log(debug.responses.slice(currentResponse.current))
        debug.responses
            .slice(currentResponse.current)
            .flatMap(response => response.events)
            .forEach(event => processEvent(dispatch, event))
        currentResponse.current = debug.responses.length
    }, [debug])
}

function processEvent(dispatch: Parameters<AsyncAction>[0], event: protocol.IEvent) {
    if (!!event.started) return processStartedEvent(dispatch, event.started)
    if (!!event.inspected) return processInspectedEvent(dispatch, event.inspected)
    if (!!event.printed) return processPrintedEvent(dispatch, event.printed)
    if (!!event.locked) return processLockedEvent(dispatch, event.locked)
    if (!!event.threw) return processThrewEvent(dispatch, event.threw)
}

async function processStartedEvent(dispatch: Parameters<AsyncAction>[0], started: protocol.Event.IStarted) {
    await dispatch(debugActions.setBreakpoints())
    await dispatch(debugActions.step('continue'))
}

function processInspectedEvent(dispatch: Parameters<AsyncAction>[0], inspected: protocol.Event.IInspected) {
    if (inspected.frame.finish) dispatch(markerActions.set([]))
    else {
        const type = inspected.frame.type !== protocol.Frame.Type.EXCEPTION ? MarkerType.HIGHLIGHT : MarkerType.ERROR
        dispatch(markerActions.set([{ line: inspected.frame.line, type }]))
    }
}

function processPrintedEvent(dispatch: Parameters<AsyncAction>[0], printed: protocol.Event.IPrinted) {
    //
}

function processLockedEvent(dispatch: Parameters<AsyncAction>[0], locked: protocol.Event.ILocked) {
    //
}

function processThrewEvent(dispatch: Parameters<AsyncAction>[0], threw: protocol.Event.IThrew) {
    //
}
