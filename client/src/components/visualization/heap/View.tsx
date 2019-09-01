import * as React from 'react'
import { clamp, ilerp, svgScreenPointTransform, svgScreenVectorTransform } from '../../../Utils'

export const View = (props: {
    size: { x: number; y: number }
    onViewBoxChange?: (viewBox: number[]) => void
    children?: React.ReactNode
}) => {
    const ref = React.useRef<SVGSVGElement>()
    const click = React.useRef(false)
    const viewBox = React.useRef([props.size.x * 0.25, props.size.y * 0.25, props.size.x * 0.5, props.size.y * 0.5])
    const ranges = {
        left: [0, props.size.x],
        top: [0, props.size.y],
        width: [props.size.x * 0.25, props.size.x],
        height: [props.size.y * 0.25, props.size.y]
    }

    const moveView = (delta: { x: number; y: number }) => {
        viewBox.current[0] = clamp(viewBox.current[0] - delta.x, ranges.left[0], ranges.left[1] - viewBox.current[2])
        viewBox.current[1] = clamp(viewBox.current[1] - delta.y, ranges.top[0], ranges.top[1] - viewBox.current[3])
        ref.current.setAttribute('viewBox', viewBox.current.join(' '))
        if (props.onViewBoxChange) props.onViewBoxChange([...viewBox.current])
    }

    const scaleView = (root: { x: number; y: number }, multiplier: number) => {
        const factor = Math.min(props.size.x, props.size.y) * multiplier
        const ratio = {
            x: ilerp(root.x, viewBox.current[0], viewBox.current[0] + viewBox.current[2]),
            y: ilerp(root.y, viewBox.current[1], viewBox.current[1] + viewBox.current[3])
        }
        const size = {
            x: clamp(viewBox.current[2] - factor, ranges.width[0], ranges.width[1]),
            y: clamp(viewBox.current[3] - factor, ranges.height[0], ranges.height[1])
        }
        if (size.x === viewBox.current[2] && size.y === viewBox.current[3]) return
        viewBox.current[0] = clamp(viewBox.current[0] + factor * ratio.x, ranges.left[0], ranges.left[1] - size.x)
        viewBox.current[1] = clamp(viewBox.current[1] + factor * ratio.y, ranges.top[0], ranges.top[1] - size.y)
        viewBox.current[2] = size.x
        viewBox.current[3] = size.y
        ref.current.setAttribute('viewBox', viewBox.current.join(' '))
        if (props.onViewBoxChange) props.onViewBoxChange([...viewBox.current])
    }

    return (
        <svg
            ref={ref}
            width='100%'
            height='100%'
            viewBox={viewBox.current.join(' ')}
            preserveAspectRatio='xMidYMid meet'
            onMouseDown={event => (click.current = true)}
            onMouseUp={event => (click.current = false)}
            onMouseLeave={event => (click.current = false)}
            onMouseMove={event => {
                if (!click.current) return
                const screenDelta = { x: event.movementX, y: event.movementY }
                const [svgDelta] = svgScreenVectorTransform('toSvg', ref.current, screenDelta)
                moveView(svgDelta)
            }}
            onWheel={event => {
                const screenPoint = { x: event.clientX, y: event.clientY }
                const [svgPoint] = svgScreenPointTransform('toSvg', ref.current, screenPoint)
                scaleView(svgPoint, event.deltaY < 0 ? 0.01 : -0.01)
            }}
        >
            <g fill='none' stroke='gray' strokeWidth={1} opacity={0.1}>
                <rect x={props.size.x} y={props.size.y} width={props.size.x} height={props.size.y} />
                <rect x={props.size.x / 4} y={props.size.y / 4} width={props.size.x / 2} height={props.size.y / 2} />
            </g>
            {props.children}
        </svg>
    )
}
