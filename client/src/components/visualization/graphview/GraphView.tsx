import React from 'react'
import { useSelection } from '../../../reducers/Store'
import { GraphController } from './GraphController'
import { Heap } from './heap/Heap'
import { View } from './View'

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
                {tracer.available && <Heap controller={controller.current} updateGraph={updateGraph} tracer={tracer} />}
            </View>
        </div>
    )
})
