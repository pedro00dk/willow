import React from 'react'
import { Edge, Graph } from '../Graph'

export const SvgEdges = (props: { id: string; graph: Graph }) => {
    const container$ = React.useRef<SVGGElement>()
    const [sourceEdges, setSourceEdges] = React.useState<Edge[]>([])
    const node = props.graph.getNode(props.id)
    const edges = props.graph.getEdges(props.id)

    React.useLayoutEffect(() => {
        const nextSourceEdges = [...edges.children, ...edges.loose]
        const sameLength = sourceEdges.length === nextSourceEdges.length
        const sameEdges = sameLength && nextSourceEdges.reduce((acc, edge, i) => acc && edge === sourceEdges[i], true)
        if (!sameEdges) return setSourceEdges(nextSourceEdges)
        const updateEdges = () =>
            nextSourceEdges.forEach((edge, i) => {
                const group = container$.current.children.item(i)
                const marker = group.children.item(0) as SVGMarkerElement
                const path = group.children.item(1) as SVGPathElement
                const text = group.children.item(2) as SVGTextElement
                const polyline = marker.firstElementChild as SVGPolylineElement
                const animate = path.firstElementChild as SVGAnimateElement
                const textPath = text.firstElementChild as SVGTextPathElement
                const data = props.graph.computeEdgePathData(edge)
                const previousData = animate.getAttribute('to')
                const newEdge = previousData == undefined
                path.setAttribute('stroke', edge.color)
                path.setAttribute('stroke-width', edge.width.toString())
                polyline.setAttribute('stroke', edge.color)
                polyline.setAttribute('stroke-width', edge.width.toString())
                animate.setAttribute('dur', !newEdge && props.graph.getAnimate() ? '0.4s' : '0.001s')
                animate.setAttribute('from', previousData)
                animate.setAttribute('to', data)
                textPath.textContent = edge.text
                ;(animate as any).beginElement()
            })
        updateEdges()
        props.graph.subscribe(node.id, updateEdges)
        edges.children.forEach(edge => props.graph.subscribe(edge.target, updateEdges))
    })

    return (
        <g ref={container$}>
            {sourceEdges.map(edge => {
                const pathId = `${node.id}-${edge.name}`
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
