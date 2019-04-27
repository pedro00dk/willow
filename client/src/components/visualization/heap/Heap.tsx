import cn from 'classnames'
import * as React from 'react'
import { useDispatch, useRedux } from '../../../reducers/Store'
import { actions as visualizationActions } from '../../../reducers/visualization'
import { MemoNodeWrapper } from './NodeWrapper'

const classes = {
    container: cn('d-block', 'w-100 h-100')
}

// tslint:disable-next-line: variable-name
export const MemoHeap = React.memo(Heap)
export function Heap() {
    const dispatch = useDispatch()
    const { tracer, visualizationScale, visualizationHeaps } = useRedux(state => ({
        tracer: state.tracer,
        visualizationHeaps: state.visualization.heaps,
        visualizationScale: state.visualization.scale
    }))

    return (
        <div
            className={classes.container}
            onWheel={event => {
                const scaleMultiplier = event.deltaY < 0 ? 0.95 : event.deltaY > 0 ? 1.05 : 1
                const scale = Math.max(0.5, Math.min(visualizationScale * scaleMultiplier, 4))
                dispatch(visualizationActions.setScale(scale))
            }}
        >
            {tracer.available &&
                Object.values(visualizationHeaps[tracer.index]).map(obj => (
                    <MemoNodeWrapper
                        key={obj.reference}
                        obj={obj}
                    />
                ))}
        </div>
    )
}
