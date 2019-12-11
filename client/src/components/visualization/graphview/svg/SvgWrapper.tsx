import { css } from 'emotion'
import React from 'react'
import { colors } from '../../../../colors'
import { GraphData } from '../GraphData'
import { lerp } from './SvgView'

const classes = {
    container: css({ cursor: 'move' }),
    path: css({ stroke: colors.gray.dark, strokeWidth: 1, fill: 'none' })
}

export const SvgWrapper = (props: { id: string; graphData: GraphData; children?: React.ReactNode }) => {
    const ref = React.useRef<SVGForeignObjectElement>()

    const updateRect = (subscriptionCall?: number) => {
        const position = props.graphData.getPosition(props.id, props.graphData.getIndex(), { x: 0, y: 0 })
        const size = props.graphData.getSize(props.id, props.graphData.getIndex(), { x: 0, y: 0 })
        ref.current.setAttribute(
            'style',
            `transition: ${props.graphData.getAnimate() ? 'x 0.4s ease-out, y 0.4s ease-out' : 'none'}`
        )
        ref.current.setAttribute('x', position.x.toString())
        ref.current.setAttribute('y', position.y.toString())
        ref.current.setAttribute('width', size.x.toString())
        ref.current.setAttribute('height', size.y.toString())
    }

    React.useEffect(() => {
        updateRect()
        props.graphData.subscribe(props.id, updateRect)
    })

    return (
        <>
            <foreignObject ref={ref} className={classes.container}>
                {props.children}
            </foreignObject>
            <SvgPaths {...props} />
        </>
    )
}

// TODO refactor
const SvgPaths = (props: { id: string; graphData: GraphData }) => {
    const ref = React.useRef<SVGGElement>()
    const [pathsCount, setPathsCount] = React.useState(0)

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

    const updatePaths = (subscriptionCall?: number) => {
        const targets = props.graphData.getTargets(props.id)
        const groups = ref.current.children
        if (pathsCount !== targets.length)
            return // TODO reverse because stack references are move volatile and added first, (not to cause a mess)
        ;[...targets].reverse().forEach(({ target, delta, text }, i) => {
            const group = groups.item(i)
            const animate = group.firstElementChild.firstElementChild as SVGAnimateElement
            const textPath = group.lastElementChild.firstElementChild as SVGTextPathElement
            const sourcePosition = props.graphData.getPosition(props.id, props.graphData.getIndex())
            const targetPosition = props.graphData.getPosition(target, props.graphData.getIndex())
            const targetSize = props.graphData.getSize(target, props.graphData.getIndex())
            const curvature = props.id !== target ? 0.2 : 0
            const data = computePathData(sourcePosition, delta, targetPosition, targetSize, curvature)
            const currentData = animate.getAttribute('to')
            textPath.textContent = text
            animate.setAttribute('from', currentData)
            animate.setAttribute('to', data)
            if (data === currentData) return
            ;(animate as any).beginElement()
        })
    }

    React.useEffect(() => {
        const targetsCount = props.graphData.getTargets(props.id).length
        if (pathsCount !== targetsCount) return setPathsCount(targetsCount)
        updatePaths()
        props.graphData.subscribe(props.id, updatePaths)
        props.graphData.getTargets(props.id).forEach(({ target }) => props.graphData.subscribe(target, updatePaths))
    })

    return (
        <>
            <defs>
                <marker
                    id='end-pointer'
                    markerWidth={10}
                    markerHeight={6}
                    refX={10}
                    refY={3}
                    orient='auto'
                    markerUnits='userSpaceOnUse'
                >
                    <polyline className={classes.path} points='0 0, 10 3, 0 6' />
                </marker>
            </defs>
            <g ref={ref}>
                {[...Array(pathsCount).keys()].map(i => (
                    <g key={i}>
                        <path id={`${props.id}-${i}`} className={classes.path} markerEnd='url(#end-pointer)'>
                            <animate attributeName='d' begin='indefinite' fill='freeze' dur='0.4s' />
                        </path>
                        <text style={{ fontSize: '0.5rem' }}>
                            <textPath xlinkHref={`#${props.id}-${i}`} startOffset='50%' textAnchor='middle' />
                        </text>
                    </g>
                ))}
            </g>
        </>
    )
}
