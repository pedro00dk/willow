import { css } from 'emotion'
import React from 'react'
import ReactDom from 'react-dom'
import { colors } from '../../../../colors'
import { Edge, GraphData } from '../GraphData'
import { lerp } from './SvgView'

const classes = {
    path: css({ stroke: colors.gray.dark, strokeWidth: 1, fill: 'none' }),
    text: css({ fontSize: '0.5rem' })
}

export const SvgEdges = (props: { id: string; graphData: GraphData }) => {
    console.log(props.graphData.getEdges(props.id))

    React.useLayoutEffect(() => {
        console.log(props.graphData.getEdges(props.id))
    })
    return (
        <>
            {Object.values(props.graphData.getEdges(props.id)).map(edge => (
                <SvgEdge edge={edge} graphData={props.graphData} />
            ))}
        </>
    )
}

export const SvgEdge = (props: { edge: Edge; graphData: GraphData }) => {
    const animate$ = React.useRef<SVGAnimateElement>()
    const textPath$ = React.useRef<SVGTextPathElement>()

    const getSourceTargetPositions = () => {
        return { sourcePosition: { x: 100, y: 100 }, targetPosition: { x: 200, y: 200 } }
    }

    React.useLayoutEffect(() => {
        const updateEdge = (callId?: number) => {
            // const sourcePosition = props.graphData.getNodePosition(props.id, props.graphData.getIndex())
            // const targetPosition = props.graphData.getNodePosition(target, props.graphData.getIndex())
            const { sourcePosition, targetPosition } = getSourceTargetPositions()

            // const targetSize = props.graphData.getNodeSize(target, props.graphData.getIndex())
            // const curvature = props.id !== target ? 0.2 : 0
            // const data = computePathData(sourcePosition, delta, targetPosition, targetSize, curvature)
            // const currentData = animate.getAttribute('to')
            // textPath.textContent = text
            // animate.setAttribute('from', currentData)
            // animate.setAttribute('to', data)
            // if (data === currentData) return
            // ;(animate as any).beginElement()
        }

        updateEdge()
        // props.graphData.subscribe(props.id, updatePaths)
        // props.graphData.getTargets(props.id).forEach(({ target }) => props.graphData.subscribe(target, updatePaths))
    })

    return (
        <g>
            <path id={`${props.edge.id}-${props.edge.name}`} className={classes.path} markerEnd='url(#marker)'>
                <animate attributeName='d' begin='indefinite' fill='freeze' dur='0.4s' />
            </path>
            <text className={classes.text}>
                <textPath xlinkHref={`#${props.edge.id}-${props.edge.name}`} startOffset='50%' textAnchor='middle' />
            </text>
        </g>
    )

    // TODO organize stack computation
    const computePathData = (
        sourcePosition: { x: number; y: number },
        delta: { x: number; y: number },
        targetPosition: { x: number; y: number },
        targetSize: { x: number; y: number },
        curvature: number = 0.2
    ) => {
        let source = { x: sourcePosition.x + delta.x, y: sourcePosition.y + delta.y }
        let target = {
            x: Math.min(Math.max(source.x, targetPosition.x), targetPosition.x + targetSize.x),
            y: Math.min(Math.max(source.y, targetPosition.y), targetPosition.y + targetSize.y)
        }
        const center = { x: lerp(source.x, target.x, 0.5), y: lerp(source.y, target.y, 0.5) }
        const parallel = { x: target.x - source.x, y: target.y - source.y }
        const orthogonal = { x: parallel.y * curvature, y: -parallel.x * curvature }
        const control = { x: center.x + orthogonal.x, y: center.y + orthogonal.y }
        return `M ${source.x},${source.y} Q ${control.x},${control.y} ${target.x},${target.y}`
    }

    const updatePaths = (subscriptionCall?: number) => {}
}

export const SvgEdgeMarker = (props: { container$: SVGSVGElement }) => {
    return ReactDom.createPortal(
        <defs>
            <marker
                id=''
                markerWidth={10}
                markerHeight={6}
                refX={10}
                refY={3}
                orient='auto'
                markerUnits='userSpaceOnUse'
            >
                <polyline className={classes.path} points='0 0, 10 3, 0 6' />
            </marker>
        </defs>,
        props.container$
    )
}
