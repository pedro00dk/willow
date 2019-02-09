import * as React from 'react'

import play from '../../public/buttons/play.png'
import restart from '../../public/buttons/restart.png'
import stepInto from '../../public/buttons/stepInto.png'
import stepOut from '../../public/buttons/stepOut.png'
import stepOver from '../../public/buttons/stepOver.png'
import stop from '../../public/buttons/stop.png'


type EditorProps = {}
// tslint:disable-next-line:variable-name
export const Debugger = React.memo((props: EditorProps) => {

    return <>
        <img src={play} className='h-100' />
        <img src={stepOver} className='h-100' />
        <img src={stepInto} className='h-100' />
        <img src={stepOut} className='h-100' />
        <img src={restart} className='h-100' />
        <img src={stop} className='h-100' />
    </>
})
