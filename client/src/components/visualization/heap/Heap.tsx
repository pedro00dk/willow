import cn from 'classnames'
import * as React from 'react'
import { useRedux } from '../../../reducers/Store'
import { DefaultArray } from './DefaultArray'
import { NumericArray } from './NumericArray'

const classes = {
    container: cn('d-block', 'w-100 h-100')
}

export function Heap() {
    const { debugHeap, debugIndexer, debugResult } = useRedux(state => ({
        debugHeap: state.debugHeap,
        debugIndexer: state.debugIndexer,
        debugResult: state.debugResult
    }))

    return (
        <div className={classes.container}>
            {debugHeap.heaps.length > 0 &&
                Object.values(debugHeap.heaps[debugIndexer]).map(node => <NumericArray node={node} />)}
        </div>
    )
}
