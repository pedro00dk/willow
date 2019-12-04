import React from 'react'
import { useSelection } from '../../../reducers/Store'
import { GraphData } from './GraphData'
import { Heap } from './heap/Heap'
import { Stack } from './stack/Stack'
import { SvgView } from './svg/SvgView'

const classes = {
    container: 'd-flex w-100 h-100'
}

export const GraphView = React.memo(() => {
    const graphData = React.useRef(new GraphData({ x: 1000, y: 1000 }, { x: 20, y: 20 }))
    const forceUpdate = React.useState({})[1]
    const { tracer } = useSelection(state => ({ tracer: state.tracer }))
    graphData.current.setIndex(tracer.index)
    graphData.current.setAnimate(true)
    graphData.current.clearTargets()
    graphData.current.clearSubscriptions()

    return (
        <div className={classes.container}>
            <SvgView graphData={graphData.current}>
                <Stack graphData={graphData.current} forceUpdate={forceUpdate} tracer={tracer} />
                <Heap graphData={graphData.current} forceUpdate={forceUpdate} tracer={tracer} />
            </SvgView>
        </div>
    )
})
