import * as React from 'react'
import { connect } from 'react-redux'
import { start, stop } from '../reducers/debug'
import { CodeState, DebugState, StoreState, ThunkDispatchProp } from '../reducers/Store'

import playImg from '../../public/buttons/play.png'
import restartImg from '../../public/buttons/restart.png'
import stepIntoImg from '../../public/buttons/stepInto.png'
import stepOutImg from '../../public/buttons/stepOut.png'
import stepOverImg from '../../public/buttons/stepOver.png'
import stopImg from '../../public/buttons/stop.png'


type ConnectedDebuggerProps = { code: CodeState, debug: DebugState }
type DebuggerProps = {}
// tslint:disable-next-line:variable-name
export const Debugger = connect<ConnectedDebuggerProps, {}, DebuggerProps, StoreState>(
    state => ({ code: state.code, debug: state.debug })
)((props: ThunkDispatchProp & ConnectedDebuggerProps & DebuggerProps) => {
    return <>
        <img src={playImg} className='h-100'
            onClick={() => props.dispatch(start('python', props.code.text.join('\n')))}
        />
        <img src={stepOverImg} className='h-100' />
        <img src={stepIntoImg} className='h-100' />
        <img src={stepOutImg} className='h-100' />
        <img src={restartImg} className='h-100' />
        <img src={stopImg} className='h-100'
            onClick={() => props.dispatch(stop())}
        />
    </>
})
