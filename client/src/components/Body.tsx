import React from 'react'
import { actions, useDispatch, useGetState, useSelection } from '../reducers/Store'
import { Controls } from './controls/Controls'
import { InputEditor } from './editor/InputEditor'
import { OutputEditor } from './editor/OutputEditor'
import { SourceEditor } from './editor/SourceEditor'
import { Frame } from './utils/Frame'
import { SplitPane } from './utils/SplitPane'
import { GraphView } from './visualization/graphview/GraphView'
import { Stack } from './visualization/stack/Stack'
import { StackTrace } from './visualization/stacktrace/StackTrace'

const classes = {
    container: 'd-flex flex-column flex-fill',
    panel: 'd-flex flex-fill',
    visualization: 'd-flex w-100 h-100'
}

export const Body = () => {
    const visualization = useSelection(state => state.options.visualization)

    return (
        <div className={classes.container}>
            <Controls />
            <div className={classes.panel}>
                {visualization ? (
                    <SplitPane key={Math.random()} ratio={0.3}>
                        <SplitPane orientation='column' ratio={0.66}>
                            <Frame title='Editor'>
                                <SourceEditor />
                            </Frame>
                            <SplitPane orientation='column'>
                                <Frame title='Input'>
                                    <InputEditor />
                                </Frame>
                                <Frame title='Output'>
                                    <OutputEditor />
                                </Frame>
                            </SplitPane>
                        </SplitPane>
                        <Visualization />
                    </SplitPane>
                ) : (
                    <SplitPane key={Math.random()} ratio={0.66}>
                        <Frame title='Editor'>
                            <SourceEditor />
                        </Frame>
                        <SplitPane orientation='column'>
                            <Frame title='Input'>
                                <InputEditor />
                            </Frame>
                            <Frame title='Output'>
                                <OutputEditor />
                            </Frame>
                        </SplitPane>
                    </SplitPane>
                )}
            </div>
        </div>
    )
}

const Visualization = () => {
    const dispatch = useDispatch()
    const getState = useGetState()

    React.useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const available = getState().tracer.available
            if (available && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
            const directionChar = event.key === 'ArrowLeft' ? '<-' : '->'
            dispatch(actions.index.step(directionChar, !event.ctrlKey ? 'v' : !event.altKey ? '-' : '^'))
            const step = event.key === 'ArrowLeft' ? 'step backward' : 'step forward'
            const index = getState().index
            dispatch(actions.user.action({ name: step, payload: { index, using: 'keyboard' } }), false)
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [])

    return (
        <div className={classes.visualization} tabIndex={0}>
            <SplitPane orientation='column' ratio={0.35}>
                <SplitPane ratio={0.25} range={[0.1, 0.6]}>
                    <Frame title='Stack'>
                        <Stack />
                    </Frame>
                    <Frame title='Call tree'>
                        <StackTrace />
                    </Frame>
                </SplitPane>
                <Frame title='Heap'>
                    <GraphView />
                </Frame>
            </SplitPane>
        </div>
    )
}
