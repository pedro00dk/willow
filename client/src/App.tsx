import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import logo from '../public/logo.svg'
import { CodeEditor } from './components/Editor'
import { CodeState, Store, StoreState } from './reducers/Store'


export function App() {
    return <Store>
        <div className={cn('d-flex flex-column', css({ width: '100vw', height: '100vh' }))}>
            <div className='d-flex flex-row'>
                <div className='d-block flex-fill'>
                    <Header />
                </div>
            </div>
            <div className='d-flex flex-row flex-fill'>
                <div className='d-flex flex-column flex-fill p-3'>
                    <Body />
                </div>
            </div>
        </div>
    </Store>
}

function Header() {
    return <nav className='navbar navbar-expand static-top navbar-dark bg-dark shadow-lg'>
        <a className='navbar-brand' href='#'>
            <img src={logo} width={30} height={30} />
            <span className='ml-2'>Willow</span>
        </a>
    </nav>
}

type ConnectedBodyProps = { code: CodeState }
type BodyProps = {}
// tslint:disable-next-line:variable-name
const Body = connect<ConnectedBodyProps, {}, BodyProps, StoreState>(
    state => ({ code: state.code })
)(
    (props: DispatchProp & ConnectedBodyProps & BodyProps) => {
        return <div className='d-flex flex-row flex-fill'>
            <div className='d-flex flex-column flex-fill mr-2 border rounded shadow'>
                <div className='d-flex flex-row flex-fill'>
                    <CodeEditor
                        mode='python'
                    />
                </div>
                <div className='d-flex flex-row border' />
                <div className='d-flex flex-row flex-fill'>
                    stdio
                </div>
            </div>
            <div className='d-flex flex-column flex-fill ml-2 border rounded shadow'>
                graph
                {props.code.breakpoints}
                {props.code.text}
            </div>
        </div>
    }
)
