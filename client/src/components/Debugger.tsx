import * as React from 'react'
import { connect } from 'react-redux'
import { start, step, stop } from '../reducers/debug'
import { CodeStateProp, DebugStateProp, StoreDispatchProp, StoreState } from '../reducers/Store'

import playImg from '../../public/buttons/play.png'
import restartImg from '../../public/buttons/restart.png'
import stepIntoImg from '../../public/buttons/stepInto.png'
import stepOutImg from '../../public/buttons/stepOut.png'
import stepOverImg from '../../public/buttons/stepOver.png'
import stopImg from '../../public/buttons/stop.png'


type DebuggerProps = {}
// tslint:disable-next-line:variable-name
export const Debugger = connect<CodeStateProp & DebugStateProp, {}, DebuggerProps, StoreState>(
    state => ({ code: state.code, debug: state.debug })
)((props: StoreDispatchProp & CodeStateProp & DebugStateProp & DebuggerProps) => {
    return <>
        <img src={playImg} className='h-100'
            onClick={
                () => !props.debug.debugging
                    ? props.dispatch(start())
                    : props.dispatch(step('continue'))
            }
        />
        <img src={stepOverImg} className='h-100'
            onClick={() => props.dispatch(step('stepOver'))} />
        <img src={stepIntoImg} className='h-100'
            onClick={() => props.dispatch(step('step'))} />
        <img src={stepOutImg} className='h-100'
            onClick={() => props.dispatch(step('stepOut'))} />
        <img src={restartImg} className='h-100' />
        <img src={stopImg} className='h-100'
            onClick={() => props.dispatch(stop())}
        />
    </>
})
