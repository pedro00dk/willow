import React from 'react'
import { useSelection } from '../../../reducers/Store'
import { Graph } from './Graph'
import { Heap } from './heap/Heap'
import { Stack } from './stack/Stack'
import { SvgView } from './svg/SvgView'

const graphContext = React.createContext(new Graph({ width: 1200, height: 1000 }, { right: 20, bottom: 20 }))

export const GraphView = () => {
    const update = React.useState({})[1]
    const graph = React.useContext(graphContext)
    const [zoom, setZoom] = React.useState(devicePixelRatio)
    const { preserveLayout, tracer } = useSelection(state => ({
        preserveLayout: state.options.preserveLayout,
        tracer: state.tracer
    }))
    if (!tracer.available && !preserveLayout) graph.clearNodes()
    graph.setSize(tracer.available ? tracer.steps.length : 0)
    graph.setIndex(tracer.available ? tracer.index : 0)
    graph.setAnimate(true)
    graph.clearSubscriptions()
    graph.clearEdges()

    React.useLayoutEffect(() => {
        const onResize = () => zoom !== devicePixelRatio && setZoom(devicePixelRatio)

        addEventListener('paneResize', onResize)
        return () => removeEventListener('paneResize', onResize)
    }, [zoom])

    return (
        <SvgView graph={graph}>
            <Stack tracer={tracer} graphData={graph} update={update} />
            <Heap tracer={tracer} graphData={graph} update={update} />
        </SvgView>
    )
}
