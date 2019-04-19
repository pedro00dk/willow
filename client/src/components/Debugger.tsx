import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import playImg from '../../public/buttons/play.png'
import stepImg from '../../public/buttons/stepInto.png'
import { actions as debugIndexerActions } from '../reducers/debug/indexer'
import { actions as debugInterfaceActions } from '../reducers/debug/interface'
import { useDispatch, useRedux } from '../reducers/Store'
import { LanguageSelector } from './LanguageSelector'

const classes = {
    container: cn('d-flex flex-row align-items-center', 'shadow-sm'),
    image: cn('m-3', css({ height: '1.5rem', width: '1.5rem' }))
}

const styles = {
    image: (available: boolean, rotation: number = 0) => ({
        transform: `rotate(${rotation}deg)`,
        ...(available ? { cursor: 'pointer' } : { filter: 'grayscale(80%)' })
    })
}

export function Debugger() {
    const dispatch = useDispatch()
    const { debugInterface, debugIndexer, debugResult, debugStack } = useRedux(state => ({
        debugIndexer: state.debugIndexer,
        debugInterface: state.debugInterface,
        debugResult: state.debugResult,
        debugStack: state.debugStack
    }))

    console.log('--')
    console.log('debugger', debugInterface, debugResult, debugIndexer, debugStack)
    console.log('--')

    return (
        <div className={classes.container}>
            <LanguageSelector />
            <img
                className={classes.image}
                style={styles.image(!debugInterface.fetching)}
                src={playImg}
                title={'inspect'}
                onClick={() => dispatch(debugInterfaceActions.inspect())}
            />
            <img
                className={classes.image}
                style={styles.image(!debugInterface.fetching && debugResult.steps.length > 0, 90)}
                src={stepImg}
                title='step back'
                onClick={() => dispatch(debugIndexerActions.set(debugIndexer - 1))}
            />
            <img
                className={classes.image}
                style={styles.image(!debugInterface.fetching && debugResult.steps.length > 0, -90)}
                src={stepImg}
                title='step forward'
                onClick={() => dispatch(debugIndexerActions.set(debugIndexer + 1))}
            />
        </div>
    )
}
