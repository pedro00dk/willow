import React from 'react'
import { GraphData } from '../GraphData'

export const SvgEdges = (props: { id: string; graphData: GraphData }) => {
    const container$ = React.useRef<SVGGElement>()
    const firstDraw = React.useRef(true)
    const [edgesLength, setEdgesLength] = React.useState(0)
    const node = props.graphData.getNode(props.id)
    const edges = props.graphData.getEdges(props.id)
    
    React.useLayoutEffect(() => {
        const localEdges = [...edges.children, ...edges.loose]
        if (edgesLength !== localEdges.length) return setEdgesLength(localEdges.length)

        const updateEdges = (callId?: number) => {
            localEdges.forEach((edge, i) => {
                const group = container$.current.children.item(i)
                const marker = group.children.item(0) as SVGMarkerElement
                const path = group.children.item(1) as SVGPathElement
                const text = group.children.item(2) as SVGTextElement
                const polyline = marker.firstElementChild as SVGPolylineElement
                const animate = path.firstElementChild as SVGAnimateElement
                const textPath = text.firstElementChild as SVGTextPathElement
                const data = props.graphData.computeEdgePathData(edge)
                const currentData = animate.getAttribute('to')
                if (data === currentData) return
                animate.setAttribute('dur', !firstDraw.current && props.graphData.getAnimate() ? '0.4s' : '0.001s')
                animate.setAttribute('from', currentData)
                animate.setAttribute('to', data)
                path.setAttribute('stroke', edge.color)
                path.setAttribute('stroke-width', edge.width.toString())
                polyline.setAttribute('stroke', edge.color)
                polyline.setAttribute('stroke-width', edge.width.toString())
                textPath.textContent = edge.text
                ;(animate as any).beginElement()
            })
        }

        updateEdges()
        firstDraw.current = false
        Object.keys(props.graphData.getNodeChildren(node, 1)).forEach(id => props.graphData.subscribe(id, updateEdges))
    })

    return (
        <g ref={container$}>
            {[...Array(edgesLength).keys()].map(i => (
                <g key={i}>
                    <marker
                        id={`${props.id}-${i}-marker`}
                        markerWidth={10}
                        markerHeight={6}
                        refX={10}
                        refY={3}
                        orient='auto'
                        markerUnits='userSpaceOnUse'
                    >
                        <polyline fill='none' points='0 0, 10 3, 0 6' />
                    </marker>
                    <path id={`${props.id}-${i}`} markerEnd={`url(#${props.id}-${i}-marker)`} fill='none'>
                        <animate attributeName='d' begin='indefinite' fill='freeze' />
                    </path>
                    <text style={{ userSelect: 'none' }} fontSize='0.75rem'>
                        <textPath xlinkHref={`#${props.id}-${i}`} startOffset='50%' textAnchor='middle' />
                    </text>
                </g>
            ))}
        </g>
    )
}
