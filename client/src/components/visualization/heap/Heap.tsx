import cn from 'classnames'
import * as React from 'react'
import { useDispatch, useRedux } from '../../../reducers/Store'
import { NodeWrapper } from './NodeWrapper'

const classes = {
    container: cn('d-block', 'w-100 h-100')
}

export function Heap() {
    const selectedObjRef = React.useRef<string>(undefined)
    const dispatch = useDispatch()
    const { tracer, visualization } = useRedux(state => ({
        tracer: state.tracer,
        visualization: state.visualization
    }))

    return (
        <div className={classes.container}>
            {tracer.available &&
                Object.values(visualization.heaps[tracer.index]).map(obj => (
                    <NodeWrapper
                        key={obj.reference}
                        obj={obj}
                        objNode={visualization.objNodes[obj.reference]}
                        objOptions={visualization.objOptions[obj.reference]}
                        typeNode={visualization.typeNodes[obj.languageType]}
                        typeOptions={visualization.typeOptions[obj.languageType]}
                    />
                ))}
        </div>
    )
}
