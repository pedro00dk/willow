import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import logo from '../public/logo.svg'
import { colors } from './colors'
import { Controls } from './components/Controls'
import { InputEditor } from './components/editor/InputEditor'
import { OutputEditor } from './components/editor/OutputEditor'
import { CodeEditor } from './components/editor/SourceEditor'
import { SplitPane } from './components/SplitPane'
import { Visualization } from './components/visualization/Visualization'

const classes = {
    container: cn('d-flex flex-column', 'vw-100 vh-100'),
    header: cn('navbar', 'shadow-sm', css({ background: colors.gray.light })),
    link: cn('d-flex align-items-center', 'navbar-brand', 'p-0'),
    logo: cn(css({ width: '2rem', filter: 'invert(1)' })),
    text: cn('ml-2', css({ color: colors.black, fontSize: '1.5rem' })),
    body: cn('d-flex flex-column flex-fill')
}

export function App() {
    return (
        <div className={classes.container}>
            <nav className={classes.header}>
                <a className={classes.link} href='#'>
                    <img src={logo} className={classes.logo} />
                    <span className={classes.text}>Willow</span>
                </a>
            </nav>
            <div className={classes.body}>
                <Controls />
                <SplitPane ratio={0.3}>
                    <SplitPane layout='column'>
                        <CodeEditor />
                        <SplitPane layout='column'>
                            <InputEditor />
                            <OutputEditor />
                        </SplitPane>
                    </SplitPane>
                    <Visualization />
                </SplitPane>
            </div>
        </div>
    )
}
