import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { Responsive } from 'react-grid-layout'
import { connect } from 'react-redux'
import logo from '../public/logo.svg'
import { CodeEditor } from './components/editor/CodeEditor'
import { IOEditor } from './components/editor/IOEditor'
import { fetch } from './reducers/session'
import { ThunkDispatchProp } from './reducers/Store'


// tslint:disable-next-line:variable-name
export const App = connect()((props: ThunkDispatchProp) => {
    React.useEffect(() => { props.dispatch(fetch()) })
    return <div className={cn('container-fluid', css({ height: '100vh' }))}>
        <div className='row'>
            <div className='col p-0'>
                <Header />
            </div>
        </div>
        <div className='row'>
            <div className='col p-0'>
                <Body />
            </div>
        </div>
    </div>
})

function Header() {
    return <nav className='navbar navbar-expand static-top navbar-dark bg-dark shadow'>
        <a className='navbar-brand' href='#'>
            <img src={logo} width={30} height={30} />
            <span className='ml-2'>Willow</span>
        </a>
    </nav>
}

function Body() {
    const [size, setSize] = React.useState({ width: window.innerWidth, height: window.innerHeight })
    React.useEffect(
        () => {
            const onResize = (event: UIEvent) => setSize({ width: window.innerWidth, height: innerHeight })
            window.addEventListener('resize', onResize)
            return () => window.removeEventListener('resize', onResize)
        },
        []
    )

    return <Responsive
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 12, sm: 12, xs: 8, xxs: 4 }}
        autoSize={false}
        compactType='vertical'
        width={size.width}
        rowHeight={(size.height - 190) / 12}
        draggableCancel='.ace_content, input, textarea'
    >
        <div key='CodeEditor' className='border shadow-sm'
            data-grid={{ x: 0, y: 0, w: 4, h: 8 }}
        >
            <CodeEditor
                mode='python'
            />
        </div>
        <div key='IOEditor' className='border shadow-sm'
            data-grid={{ x: 0, y: 0, w: 4, h: 4 }}
        >
            <IOEditor />
        </div>
        <div key='Graph' className='border shadow-sm'
            data-grid={{ x: 4, y: 0, w: 8, h: 12 }}
        >
            Graph
        </div>
    </Responsive>
}
