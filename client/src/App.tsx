import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import logo from '../public/logo.svg'
import { Debugger } from './components/Debugger'
import { CodeEditor } from './components/editor/CodeEditor'
import { InputEditor } from './components/editor/InputEditor'
import { OutputEditor } from './components/editor/OutputEditor'
import { SplitPane } from './components/SplitPane'
import { Visualization } from './components/visualization/Visualization'

const classes = {
    app: { container: 'd-flex flex-column vh-100 vw-100', spacer: 'p-1' },
    header: {
        container: 'navbar navbar-expand navbar-light shadow-sm static-top',
        link: 'd-flex flex-row align-items-center navbar-brand',
        logo: css({ height: '2.5rem', width: '2.5rem', filter: 'invert(1)' }),
        text: cn('ml-2', css({ fontSize: '2rem' }))
    },
    body: {
        container: 'd-flex flex-column flex-fill',
        splitPane: '',
        pane: ''
    }
}

export function App() {
    return (
        <div className={classes.app.container}>
            <Header />
            <span className={classes.app.spacer} />
            <Body />
        </div>
    )
}

function Header() {
    return (
        <nav className={classes.header.container}>
            <a className={classes.header.link} href='#'>
                <img src={logo} className={classes.header.logo} />
                <span className={classes.header.text}>Willow</span>
            </a>
        </nav>
    )
}

function Body() {
    return (
        <div className={classes.body.container}>
            <Debugger />
            <SplitPane split='vertical' base='30%' left={5} right={-5}>
                <SplitPane split='horizontal' base='70%' left={5} right={-5}>
                    <CodeEditor />
                    <SplitPane split='horizontal' base='50%' left={5} right={-5}>
                        <InputEditor />
                        <OutputEditor />
                    </SplitPane>
                </SplitPane>
                <Visualization />
            </SplitPane>
        </div>
    )
}
