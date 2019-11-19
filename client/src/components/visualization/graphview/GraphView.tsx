import React from 'react'
import { useSelection } from '../../../reducers/Store'
import { GraphController } from './GraphController'
import { Heap } from './heap/Heap'
import { SvgView } from './SvgView'

const classes = {
    container: 'd-flex w-100 h-100'
}

export const GraphView = React.memo(() => {
    const controller = React.useRef(new GraphController({ x: 1000, y: 1000 }, { x: 20, y: 20 }))
    const updateGraph = React.useState({})[1]
    const { tracer } = useSelection(state => ({ tracer: state.tracer }))
    controller.current.clearSubscriptions()
    controller.current.clearTargets()
    controller.current.setIndex(tracer.index)

    return (
        <div className={classes.container}>
            <SvgView size={controller.current.getGraphSize()}>
                {tracer.available && <Heap controller={controller.current} updateGraph={updateGraph} tracer={tracer} />}
            </SvgView>
        </div>
    )
})
