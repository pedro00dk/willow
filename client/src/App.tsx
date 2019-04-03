import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import logo from '../public/logo.svg'
import { Debugger } from './components/Debugger'
import { CodeEditor } from './components/editor/CodeEditor'
import { SplitPane } from './components/SplitPane'

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
    {
        /* <div key='Debugger' className='border shadow-sm' data-grid={{ x: 0, y: 0, w: 12, h: 1, static: true }}>
        </div> */
    }
    {
        /* <div key='CodeEditor' className='border shadow-sm' data-grid={{ x: 0, y: 1, w: 4, h: 11 }}>
        </div>
        */
    }
    return (
        <div className='flex-fill'>
            <SplitPane resizable={false} split='horizontal'>
                <Debugger />
                <SplitPane resizable split='vertical' base='35%' left={50} right={-50}>
                    <CodeEditor mode='python' />
                    <div>Graph</div>
                </SplitPane>
            </SplitPane>
        </div>
    )
}
