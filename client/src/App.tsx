import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import logo from '../public/logo.svg'
import { colors } from './colors'
import { MemoControls } from './components/Controls'
import { MemoCodeEditor } from './components/editor/CodeEditor'
import { MemoInputEditor } from './components/editor/InputEditor'
import { MemoOutputEditor } from './components/editor/OutputEditor'
import { MemoSplitPane } from './components/SplitPane'
import { Visualization } from './components/visualization/Visualization'

const classes = {
    app: {
        container: cn('d-flex flex-column', 'vw-100 vh-100')
    },
    header: {
        container: cn('navbar', 'shadow-sm', css({ background: colors.gray.light })),
        link: cn('d-flex align-items-center', 'navbar-brand', 'p-0'),
        logo: cn(css({ width: '2rem', filter: 'invert(1)' })),
        text: cn('ml-2', css({ color: colors.black, fontSize: '1.5rem' }))
    },
    body: {
        container: cn('flex-fill', 'd-flex flex-column')
    }
}

export function App() {
    return (
        <div className={classes.app.container}>
            <Header />
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
            <MemoControls />
            <MemoSplitPane split='vertical' base='30%' left={5} right={-5}>
                <MemoSplitPane split='horizontal' base='70%' left={5} right={-5}>
                    <MemoCodeEditor />
                    <MemoSplitPane split='horizontal' base='50%' left={5} right={-5}>
                        <MemoInputEditor />
                        <MemoOutputEditor />
                    </MemoSplitPane>
                </MemoSplitPane>
                <Visualization />
            </MemoSplitPane>
        </div>
    )
}
