import React from 'react'
import { Edge, GraphData } from '../GraphData'

export const SvgEdges = (props: { id: string; graphData: GraphData }) => {
    const container$ = React.useRef<SVGGElement>()
    const [currentSourceEdges, setCurrentSourceEdges] = React.useState<Edge[]>([])
    const node = props.graphData.getNode(props.id)
    const edges = props.graphData.getEdges(node.id)

    React.useLayoutEffect(() => {
        const sourceEdges = [...edges.children, ...edges.loose]
        if (
            currentSourceEdges.length !== sourceEdges.length ||
            !sourceEdges.reduce((acc, edge, i) => acc && edge === currentSourceEdges[i], true)
        )
            return setCurrentSourceEdges(sourceEdges)

        const updateEdges = (callId?: number) =>
            sourceEdges.forEach((edge, i) => {
                const group = container$.current.children.item(i)
                const marker = group.children.item(0) as SVGMarkerElement
                const path = group.children.item(1) as SVGPathElement
                const text = group.children.item(2) as SVGTextElement
                const polyline = marker.firstElementChild as SVGPolylineElement
                const animate = path.firstElementChild as SVGAnimateElement
                const textPath = text.firstElementChild as SVGTextPathElement
                const data = props.graphData.computeEdgePathData(edge)
                const currentData = animate.getAttribute('to')
                const newEdge = currentData == undefined
                animate.setAttribute('dur', !newEdge && props.graphData.getAnimate() ? '0.4s' : '0.001s')
                animate.setAttribute('from', currentData)
                animate.setAttribute('to', data)
                path.setAttribute('stroke', edge.color)
                path.setAttribute('stroke-width', edge.width.toString())
                polyline.setAttribute('stroke', edge.color)
                polyline.setAttribute('stroke-width', edge.width.toString())
                textPath.textContent = edge.text
                ;(animate as any).beginElement()
            })

        updateEdges()
        Object.keys(props.graphData.getNodeChildren(node, 1)).forEach(id => props.graphData.subscribe(id, updateEdges))
    })

    return (
        <g ref={container$}>
            {currentSourceEdges.map(edge => {
                const pathId = `${edge.id}-${edge.name}`
                const markerId = `${pathId}-marker`
                return (
                    <g key={edge.name}>
                        <marker
                            id={markerId}
                            markerWidth={10}
                            markerHeight={6}
                            refX={10}
                            refY={3}
                            orient='auto'
                            markerUnits='userSpaceOnUse'
                        >
                            <polyline fill='none' points='0 0, 10 3, 0 6' />
                        </marker>
                        <path id={pathId} markerEnd={`url(#${markerId}`} fill='none'>
                            <animate attributeName='d' begin='indefinite' fill='freeze' />
                        </path>
                        <text style={{ userSelect: 'none' }} fontSize='0.75rem'>
                            <textPath xlinkHref={`#${pathId}`} startOffset='50%' textAnchor='middle' />
                        </text>
                    </g>
                )
            })}
        </g>
    )
}
