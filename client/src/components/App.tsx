import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import { DefaultStore, useDispatch } from '../reducers/Store'
import { actions as tracerActions } from '../reducers/tracer'
import logo from '../../public/logo.svg'
import { Controls } from './controls/Controls'
import { InputEditor } from './editor/InputEditor'
import { OutputEditor } from './editor/OutputEditor'
import { SourceEditor } from './editor/SourceEditor'
import { Frame } from './utils/Frame'
import { SplitPane } from './utils/SplitPane'
import { StackTrace } from './visualization/stacktrace/StackTrace'
import { GraphView } from './visualization/graphview/GraphView'
import { Stack } from './visualization/stack/Stack'

const classes = {
    container: 'd-flex flex-column vw-100 vh-100',
    header: {
        container: 'navbar navbar-light bg-light shadow-sm',
        brand: 'd-flex navbar-brand align-items-center',
        logo: cn('mr-2', css({ filter: 'invert(1)', width: '2rem' })),
        leftMenu: 'navbar-nav flex-row',
        rightMenu: 'navbar-nav flex-row ml-auto',
        menuItem: 'nav-item active px-2',
        menuText: 'navbar-text',
        itemLink: 'nav-link'
    },
    body: {
        container: 'd-flex flex-column flex-fill',
        panel: 'd-flex flex-fill'
    },
    visualization: 'd-flex w-100 h-100'
}

export const App = () => (
    <DefaultStore>
        <div className={classes.container}>
            <Header />
            <Body />
        </div>
    </DefaultStore>
)

const Header = () => (
    <header className={classes.header.container}>
        <a className={classes.header.brand} href='#'>
            <img className={classes.header.logo} src={logo} />
            {'Willow'}
        </a>
        <ul className={classes.header.leftMenu}>
            <li className={classes.header.menuItem}>
                <a
                    className={classes.header.itemLink}
                    href='https://github.com/pedro00dk/willow/blob/master/docs/HOW_TO_USE.md'
                    target='_blank'
                >
                    {'How to use'}
                </a>
            </li>
        </ul>
        <ul className={classes.header.rightMenu}>
            <span className={classes.header.menuText}>{'User name'}</span>
            <li className={classes.header.menuItem}>
                <a className={classes.header.itemLink} href='#'>
                    {'Login with Google'}
                </a>
            </li>
        </ul>
    </header>
)

const Body = () => (
    <div className={classes.body.container}>
        <Controls />
        <div className={classes.body.panel}>
            <SplitPane ratio={0.3}>
                <Editors />
                <Visualization />
            </SplitPane>
        </div>
    </div>
)

const Editors = () => (
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
)

const Visualization = () => {
    const dispatch = useDispatch()

    return (
        <div
            className={classes.visualization}
            onKeyDown={event => {
                if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
                dispatch(
                    tracerActions.stepIndex(
                        event.key === 'ArrowLeft' ? 'backward' : 'forward',
                        !event.ctrlKey ? 'into' : !event.altKey ? 'over' : 'out'
                    )
                )
            }}
            tabIndex={0}
        >
            <SplitPane orientation='column' ratio={0.35}>
                <SplitPane ratio={0.25} range={[0.1, 0.6]}>
                    <Stack />
                    <StackTrace />
                </SplitPane>
                <GraphView />
            </SplitPane>
        </div>
    )
}
