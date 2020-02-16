import React from 'react'
import { useSelection } from '../../../reducers/Store'
import { GraphData } from './GraphData'
import { Heap } from './heap/Heap'
import { Stack } from './stack/Stack'
import { SvgView } from './svg/SvgView'

export const GraphView = () => {
    const graphData = React.useRef(new GraphData({ width: 1200, height: 1000 }, { x: 20, y: 20 }))
    const [zoom, setZoom] = React.useState(globalThis.devicePixelRatio)
    const update = React.useState({})[1]
    const { preserveLayout, tracer } = useSelection(state => ({
        preserveLayout: state.options.preserveLayout,
        tracer: state.tracer
    }))
    if (!preserveLayout && !tracer.steps) graphData.current.clearNodes()
    graphData.current.setSize(tracer.steps?.length ?? 0)
    graphData.current.setIndex(tracer.index ?? 0)
    graphData.current.setAnimate(true)
    graphData.current.clearSubscriptions()
    graphData.current.clearRenders()
    graphData.current.clearEdges()

    React.useLayoutEffect(() => {
        const onResize = (event: Event) => zoom !== globalThis.devicePixelRatio && setZoom(globalThis.devicePixelRatio)

        globalThis.addEventListener('paneResize', onResize)
        return () => globalThis.removeEventListener('paneResize', onResize)
    }, [zoom])

    return (
        <SvgView graphData={graphData.current}>
            <Stack graphData={graphData.current} update={update} tracer={tracer} />
            <Heap graphData={graphData.current} update={update} tracer={tracer} />
        </SvgView>
    )
}
