import React from 'react'
import { useSelection } from '../../../reducers/Store'
import { GraphController } from './GraphController'
import { View } from './View'
import { Wrapper } from './Wrapper'

const classes = {
    container: 'd-flex w-100 h-100'
}

export const GraphView = React.memo(() => {
    const controller = React.useRef(new GraphController())
    const updateGraph = React.useState({})[1]
    const { tracer } = useSelection(state => ({ tracer: state.tracer }))
    const viewSize = { x: 1000, y: 1000 }
    controller.current.clearTargets()
    controller.current.clearSubscriptions()

    return (
        <div className={classes.container}>
            <View size={viewSize}>
                {tracer.available &&
                    Object.values(tracer.heapsData[tracer.index]).map(objData => (
                        <Wrapper
                            key={objData.id}
                            objData={objData}
                            heapControl={controller.current}
                            updateHeap={updateGraph}
                            tracer={tracer}
                        />
                    ))}
            </View>
        </div>
    )
})
