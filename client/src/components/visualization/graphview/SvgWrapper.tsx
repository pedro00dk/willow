import { css } from 'emotion'
import React from 'react'
import { GraphController } from './GraphController'
import { colors } from '../../../colors'

const classes = {
    container: css({ cursor: 'move' }),
    path: css({ stroke: colors.gray.dark, strokeWidth: 2, fill: 'none' })
}

export const SvgWrapper = (props: {
    id: string
    paths: number
    controller: GraphController
    updateGraph: React.Dispatch<{}>
    children?: React.ReactNode
}) => {
    const ref = React.useRef<SVGForeignObjectElement>()
    const pathsRef = React.useRef<SVGForeignObjectElement>()

    const lerp = (from: number, to: number, gradient: number) => from * (1 - gradient) + to * gradient

    const computePath = (
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

    const updateRect = (subscriptionCall?: number) => {
        const position = props.controller.getPosition(props.id, props.controller.getIndex(), { x: 0, y: 0 })
        const size = props.controller.getSize(props.id, props.controller.getIndex(), { x: 0, y: 0 })
        ref.current.setAttribute('x', position.x.toString())
        ref.current.setAttribute('y', position.y.toString())
        ref.current.setAttribute('width', size.x.toString())
        ref.current.setAttribute('height', size.y.toString())
    }

    const updatePaths = (subscriptionCall?: number) => {
        const targets = props.controller.getTargets(props.id)
        const paths = pathsRef.current.children
        targets.forEach(({ target, delta }, i) => {
            if (i >= paths.length) return
            const sourcePosition = props.controller.getPosition(props.id, props.controller.getIndex())
            const targetPosition = props.controller.getPosition(target, props.controller.getIndex())
            const targetSize = props.controller.getSize(target, props.controller.getIndex())
            if (!targetPosition) return
            const pathD = computePath(sourcePosition, delta, targetPosition, targetSize)
            paths[i].setAttribute('d', pathD)
            paths[i].setAttribute('class', classes.path)
            paths[i].setAttribute('marker-end', 'url(#pointer)')
        })
    }

    React.useEffect(() => {
        updateRect()
        updatePaths()
        props.controller.subscribe(props.id, updateRect)
        props.controller.subscribe(props.id, updatePaths)
        props.controller.getTargets(props.id).forEach(({ target }) => props.controller.subscribe(target, updatePaths))
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
            <g ref={pathsRef}>
                {[...Array(props.paths).keys()].map(i => (
                    <path key={i} className={classes.path} markerEnd='url(#pointer)' />
                ))}
                <path />
            </g>
        </>
    )
}
