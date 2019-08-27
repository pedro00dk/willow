import * as React from 'react'

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
const lerp = (ratio: number, from: number, to: number) => from * (1 - ratio) + to * ratio
const ilerp = (value: number, from: number, to: number) => (value - from) / (to - from)

export const svgScreenPointTransform = (
    direction: 'toSvg' | 'toScreen',
    svgElement: SVGGraphicsElement,
    ...points: { x: number; y: number }[]
) => {
    const svgToScreenTransformMatrix = svgElement.getScreenCTM()
    const transformMatrix = direction === 'toSvg' ? svgToScreenTransformMatrix.inverse() : svgToScreenTransformMatrix
    return points.map(point => {
        const transformedDomPoint = new DOMPoint(point.x, point.y).matrixTransform(transformMatrix)
        return { x: transformedDomPoint.x, y: transformedDomPoint.y }
    })
}

export const svgScreenVectorTransform = (
    direction: 'toSvg' | 'toScreen',
    svgElement: SVGGraphicsElement,
    ...vectors: { x: number; y: number }[]
) => {
    const [root, ...shiftedVectors] = svgScreenPointTransform(direction, svgElement, { x: 0, y: 0 }, ...vectors)
    return shiftedVectors.map(shiftedVector => ({ x: shiftedVector.x - root.x, y: shiftedVector.y - root.y }))
}

export const SvgView = (props: {
    size: { width: number; height: number }
    markers: boolean
    children?: React.ReactNode
}) => {
    const ref = React.useRef<SVGSVGElement>()
    const click = React.useRef(false)
    const viewBox = React.useRef([
        props.size.width * 0.25,
        props.size.height * 0.25,
        props.size.width * 0.5,
        props.size.height * 0.5
    ])
    const ranges = {
        x: [0, props.size.width],
        y: [0, props.size.height],
        width: [props.size.width * 0.25, props.size.width],
        height: [props.size.height * 0.25, props.size.height]
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
                const screenDeltaVector = { x: event.movementX, y: event.movementY }
                const [svgDeltaVector] = svgScreenVectorTransform('toSvg', ref.current, screenDeltaVector)
                viewBox.current[0] = clamp(
                    viewBox.current[0] - svgDeltaVector.x,
                    ranges.x[0],
                    ranges.x[1] - viewBox.current[2]
                )
                viewBox.current[1] = clamp(
                    viewBox.current[1] - svgDeltaVector.y,
                    ranges.y[0],
                    ranges.y[1] - viewBox.current[3]
                )
                ref.current.setAttribute('viewBox', viewBox.current.join(' '))
            }}
            onWheel={event => {
                const screenPoint = { x: event.clientX, y: event.clientY }
                const [svgPoint] = svgScreenPointTransform('toSvg', ref.current, screenPoint)
                const delta = Math.min(props.size.width, props.size.height) * (event.deltaY < 0 ? 0.01 : -0.01)
                const xRatio = ilerp(svgPoint.x, viewBox.current[0], viewBox.current[0] + viewBox.current[2])
                const yRatio = ilerp(svgPoint.y, viewBox.current[1], viewBox.current[1] + viewBox.current[3])
                const width = clamp(viewBox.current[2] - delta, ranges.width[0], ranges.width[1])
                const height = clamp(viewBox.current[3] - delta, ranges.height[0], ranges.height[1])
                if (width === viewBox.current[2] && height === viewBox.current[3]) return
                viewBox.current[2] = width
                viewBox.current[3] = height
                viewBox.current[0] = clamp(viewBox.current[0] + delta * xRatio, ranges.x[0], ranges.x[1] - width)
                viewBox.current[1] = clamp(viewBox.current[1] + delta * yRatio, ranges.y[0], ranges.y[1] - height)
                ref.current.setAttribute('viewBox', viewBox.current.join(' '))
            }}
        >
            {props.markers && (
                <g fill='none' stroke='gray' strokeWidth='1'>
                    <rect {...props.size} width={props.size.width} height={props.size.height} opacity={0.4} />
                    <rect
                        x={props.size.width * 0.125}
                        y={props.size.height * 0.125}
                        width={props.size.width * 0.75}
                        height={props.size.height * 0.75}
                        opacity={0.2}
                    />
                    <rect
                        x={props.size.width * 0.25}
                        y={props.size.height * 0.25}
                        width={props.size.width * 0.5}
                        height={props.size.height * 0.5}
                        opacity={0.1}
                    />
                    <rect
                        x={props.size.width * 0.375}
                        y={props.size.height * 0.375}
                        width={props.size.width * 0.25}
                        height={props.size.height * 0.25}
                        opacity={0.05}
                    />
                </g>
            )}
            {props.children}
        </svg>
    )
}
