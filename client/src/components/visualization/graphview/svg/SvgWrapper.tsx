import { css } from 'emotion'
import React from 'react'
import { colors } from '../../../../colors'
import { GraphData } from '../GraphData'
import { lerp } from './SvgView'

const classes = {
    container: css({ cursor: 'move' }),
    path: css({ stroke: colors.gray.dark, strokeWidth: 2, fill: 'none' })
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
            <defs>
                <marker
                    id='pointer'
                    markerWidth={10}
                    markerHeight={8}
                    refX={8}
                    refY={4}
                    orient='auto'
                    markerUnits='userSpaceOnUse'
                >
                    <polyline className={classes.path} points='0 0, 10 4, 0 8' />
                </marker>
            </defs>
            <foreignObject ref={ref} className={classes.container}>
                {props.children}
            </foreignObject>
            <SvgPaths {...props} />
        </>
    )
}

const SvgPaths = (props: { id: string; graphData: GraphData }) => {
    const ref = React.useRef<SVGGElement>()
    const [pathsCount, setPathsCount] = React.useState(0)

    const computePathData = (
        sourcePosition: { x: number; y: number },
        delta: { x: number; y: number },
        targetPosition: { x: number; y: number },
        targetSize: { x: number; y: number }
    ) => {
        const source = { x: sourcePosition.x + delta.x, y: sourcePosition.y + delta.y }
        const target = {
            x: Math.min(Math.max(source.x, targetPosition.x), targetPosition.x + targetSize.x),
            y: Math.min(Math.max(source.y, targetPosition.y), targetPosition.y + targetSize.y)
        }
        const center = { x: lerp(source.x, target.x, 0.5), y: lerp(source.y, target.y, 0.5) }
        const parallelVector = { x: target.x - source.x, y: target.y - source.y }
        const orthogonalVector = { x: parallelVector.y / 4, y: -parallelVector.x / 4 }
        const control = { x: center.x + orthogonalVector.x, y: center.y + orthogonalVector.y }
        return `M ${source.x},${source.y} Q ${control.x},${control.y} ${target.x},${target.y}`
    }

    const updatePaths = (subscriptionCall?: number) => {
        const targets = props.graphData.getTargets(props.id)
        const paths = ref.current.children
        if (pathsCount !== targets.length) return
        targets.forEach(({ target, delta }, i) => {
            const path = paths.item(i)
            const animate = path.firstElementChild as SVGAnimateElement
            const sourcePosition = props.graphData.getPosition(props.id, props.graphData.getIndex())
            const targetPosition = props.graphData.getPosition(target, props.graphData.getIndex())
            const targetSize = props.graphData.getSize(target, props.graphData.getIndex())
            if (!targetPosition) return console.log('no target')
            const data = computePathData(sourcePosition, delta, targetPosition, targetSize)
            const currentData = animate.getAttribute('to')
            if (data === currentData) return
            animate.setAttribute('from', currentData)
            animate.setAttribute('to', data)
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
        <g ref={ref}>
            {[...Array(pathsCount).keys()].map(i => (
                <path key={i} className={classes.path} markerEnd='url(#pointer)'>
                    <animate attributeName='d' attributeType='XML' begin='indefinite' fill='freeze' dur="0.4s"/>
                </path>
            ))}
        </g>
    )
}
