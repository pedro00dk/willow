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

const styles = {
    navbarLogo: css({ height: '2.5rem', width: '2.5rem', filter: 'invert(1)' }),
    navbarText: css({ fontSize: '2rem' })
}

export function App() {
    return (
        <div className={cn('d-flex', 'flex-column', 'vh-100', 'vw-100')}>
            <Header />
            <div className='pb-2' />
            <Body />
        </div>
    )
}

function Header() {
    return (
        <nav className='navbar navbar-expand navbar-light shadow-sm static-top'>
            <a className='d-flex flex-row align-items-center navbar-brand' href='#'>
                <img src={logo} className={styles.navbarLogo} />
                <span className={cn('ml-2', styles.navbarText)}>Willow</span>
            </a>
        </nav>
    )
}

function Body() {
    return (
        <div className='d-flex flex-column flex-fill'>
            <Debugger />
            <SplitPane className='d-flex position-relative' resizable split='vertical' base='35%' left={50} right={-50}>
                <SplitPane
                    className='d-flex position-relative'
                    resizable
                    split='horizontal'
                    base='70%'
                    left={50}
                    right={-100}
                >
                    <CodeEditor />
                    <SplitPane
                        className='d-flex position-relative'
                        resizable
                        split='horizontal'
                        base='35%'
                        left={50}
                        right={-50}
                    >
                        <InputEditor />
                        <OutputEditor />
                    </SplitPane>
                </SplitPane>
                <Visualization />
            </SplitPane>
        </div>
    )
}
