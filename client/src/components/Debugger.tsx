import * as React from 'react'
import { start, step, stop } from '../reducers/debug'
import { useDispatch, useRedux } from '../reducers/Store'

import playImg from '../../public/buttons/play.png'
import restartImg from '../../public/buttons/restart.png'
import stepIntoImg from '../../public/buttons/stepInto.png'
import stepOutImg from '../../public/buttons/stepOut.png'
import stepOverImg from '../../public/buttons/stepOver.png'
import stopImg from '../../public/buttons/stop.png'


export function Debugger() {
    const dispatch = useDispatch()
    const debug = useRedux(state => ({ debug: state.debug })).debug
    return <>
        <img src={playImg} className='h-100'
            onClick={() => !debug.debugging ? dispatch(start()) : dispatch(step('continue'))}
        />
        <img src={stepOverImg} className='h-100'
            onClick={() => dispatch(step('stepOver'))}
        />
        <img src={stepIntoImg} className='h-100'
            onClick={() => dispatch(step('step'))}
        />
        <img src={stepOutImg} className='h-100'
            onClick={() => dispatch(step('stepOut'))}
        />
        <img src={restartImg} className='h-100' />
        <img src={stopImg} className='h-100'
            onClick={() => dispatch(stop())}
        />
    </>
}
