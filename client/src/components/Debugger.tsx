import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import playImg from '../../public/buttons/play.png'
import { actions as debugInterfaceActions } from '../reducers/debug/interface'
import { useDispatch, useRedux } from '../reducers/Store'
import { LanguageSelector } from './LanguageSelector'

const classes = {
    image: cn('m-3', css({ height: '1.5rem', width: '1.5rem' })),
    select: css({ flex: '0 1 auto !important', width: 'auto !important' }),
    input: css({ display: 'inline-flex !important', width: 'auto !important' })
}

const styles = {
    image: (available: boolean) => (available ? { cursor: 'pointer' } : { filter: 'grayscale(80%)' })
}

export function Debugger() {
    const dispatch = useDispatch()
    const { debugInterface, debugResponse, debugReference, debugStack } = useRedux(state => ({
        debugInterface: state.debugInterface,
        debugReference: state.debugReference,
        debugResponse: state.debugResponse,
        debugStack: state.debugStack
    }))

    console.log('debugger')
    console.log(debugInterface)
    console.log(debugResponse)
    console.log(debugReference)
    console.log(debugStack)
    console.log('-------')

    return (
        <div className='d-flex flex-row align-items-center shadow-sm mb-1'>
            <LanguageSelector />
            <img
                className={classes.image}
                style={styles.image(!debugInterface.fetching)}
                src={playImg}
                title={'inspect'}
                onClick={() => dispatch(debugInterfaceActions.inspect())}
            />
        </div>
    )
}
