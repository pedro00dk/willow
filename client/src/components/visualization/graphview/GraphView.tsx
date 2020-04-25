import React from 'react'
import { useSelection } from '../../../reducers/Store'
import { Graph } from './Graph'
import { Heap } from './heap/Heap'
import { Stack } from './stack/Stack'
import { SvgView } from './svg/SvgView'

const graphContext = React.createContext(
    new Graph({ width: 1200, height: 1000 }, { left: 0, top: 0, right: 20, bottom: 20 })
)

export const GraphView = () => {
    const update = React.useState({})[1]
    const graph = React.useContext(graphContext)
    const [zoom, setZoom] = React.useState(devicePixelRatio)
    const { preserveLayout, index, tracer } = useSelection(state => ({
        preserveLayout: state.options.preserveLayout,
        index: state.index,
        tracer: state.tracer
    }))
    if (!tracer.available && !preserveLayout) graph.clearNodes()
    graph.steps = tracer.available ? tracer.steps.length : 0
    graph.index = tracer.available ? index : 0
    graph.animate = true
    graph.subscriptions.clear()
    graph.clearEdges()

    React.useLayoutEffect(() => {
        const onResize = () => zoom !== devicePixelRatio && setZoom(devicePixelRatio)
        addEventListener('paneResize', onResize)
        return () => removeEventListener('paneResize', onResize)
    }, [])

    return (
        <SvgView graph={graph}>
            {tracer.available && (
                <>
                    <Stack tracer={tracer} graph={graph} update={update} />
                    <Heap tracer={tracer} graph={graph} update={update} />
                </>
            )}
        </SvgView>
    )
}
