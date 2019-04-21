import cn from 'classnames'
import * as React from 'react'
import { useDispatch, useRedux } from '../../../reducers/Store'
import { actions as visualizationActions } from '../../../reducers/visualization'
import { NodeWrapper } from './NodeWrapper'

const classes = {
    container: cn('d-block', 'w-100 h-100')
}

export function Heap() {
    const dispatch = useDispatch()
    const { tracer, visualization } = useRedux(state => ({
        tracer: state.tracer,
        visualization: state.visualization
    }))

    return (
        <div
            className={classes.container}
            onWheel={event => {
                const scaleMultiplier = event.deltaY < 0 ? 0.95 : event.deltaY > 0 ? 1.05 : 1
                const scale = Math.max(0.5, Math.min(visualization.scale * scaleMultiplier, 4))
                dispatch(visualizationActions.setScale(scale))
            }}
        >
            {tracer.available &&
                Object.values(visualization.heaps[tracer.index]).map(obj => (
                    <NodeWrapper
                        key={obj.reference}
                        obj={obj}
                        objNode={visualization.objNodes[obj.reference]}
                        objOptions={visualization.objOptions[obj.reference]}
                        typeNode={visualization.typeNodes[obj.languageType]}
                        typeOptions={visualization.typeOptions[obj.languageType]}
                        scale={visualization.scale}
                    />
                ))}
        </div>
    )
}
