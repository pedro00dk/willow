import React from 'react'
import { useSelection } from '../../../reducers/Store'
import { GraphData } from './GraphData'
import { Heap } from './heap/Heap'
import { Stack } from './stack/Stack'
import { SvgView } from './svg/SvgView'

export const GraphView = React.memo(() => {
    const forceUpdate = React.useState({})[1]
    const { tracer } = useSelection(state => ({ tracer: state.tracer }))
    const graphData = React.useRef(new GraphData({ width: 1200, height: 1000 }, { x: 20, y: 20 }))
    graphData.current.setIndex(tracer.index)
    graphData.current.setAnimate(true)
    graphData.current.clearSubscriptions()
    graphData.current.clearEdges()

    return (
        <SvgView graphData={graphData.current}>
            <Stack graphData={graphData.current} forceUpdate={forceUpdate} tracer={tracer} />
            <Heap graphData={graphData.current} forceUpdate={forceUpdate} tracer={tracer} />
        </SvgView>
    )
})
