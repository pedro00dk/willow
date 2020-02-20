import React from 'react'
import { useSelection } from '../../../reducers/Store'
import { GraphData } from './GraphData'
import { Heap } from './heap/Heap'
import { Stack } from './stack/Stack'
import { SvgView } from './svg/SvgView'

export const GraphView = () => {
    const update = React.useState({})[1]
    const graphData = React.useRef(new GraphData({ width: 1200, height: 1000 }, { x: 20, y: 20 }))
    const [zoom, setZoom] = React.useState(devicePixelRatio)
    const { preserveLayout, tracer } = useSelection(state => ({
        preserveLayout: state.options.preserveLayout,
        tracer: state.tracer
    }))
    if (!tracer.available && !preserveLayout) graphData.current.clearNodes()
    graphData.current.setSize(tracer.available ? tracer.steps.length : 0)
    graphData.current.setIndex(tracer.available ? tracer.index : 0)
    graphData.current.setAnimate(true)
    graphData.current.clearSubscriptions()
    graphData.current.clearEdges()

    React.useLayoutEffect(() => {
        const onResize = (event: Event) => zoom !== devicePixelRatio && setZoom(devicePixelRatio)

        addEventListener('paneResize', onResize)
        return () => removeEventListener('paneResize', onResize)
    }, [zoom])

    return (
        <SvgView graphData={graphData.current}>
            <Stack tracer={tracer} graphData={graphData.current} update={update} />
            <Heap tracer={tracer} graphData={graphData.current} update={update} />
        </SvgView>
    )
}
