import React from 'react'
import { GraphData } from '../GraphData'

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export const ilerp = (value: number, from: number, to: number) => (value - from) / (to - from)

export const lerp = (from: number, to: number, gradient: number) => from * (1 - gradient) + to * gradient

export const svgScreenTransformPoint = (
    direction: 'toSvg' | 'toScreen',
    svgElement: SVGGraphicsElement,
    ...points: { x: number; y: number }[]
) => {
    const toScreenTransformMatrix = svgElement.getScreenCTM()
    const matrix = direction === 'toSvg' ? toScreenTransformMatrix.inverse() : toScreenTransformMatrix
    return points.map(point => new DOMPoint(point.x, point.y).matrixTransform(matrix) as { x: number; y: number })
}

export const svgScreenTransformVector = (
    direction: 'toSvg' | 'toScreen',
    svgElement: SVGGraphicsElement,
    ...vectors: { x: number; y: number }[]
) => {
    const [root, ...shiftedVectors] = svgScreenTransformPoint(direction, svgElement, { x: 0, y: 0 }, ...vectors)
    shiftedVectors.forEach(vector => ((vector.x -= root.x), (vector.y -= root.y)))
    return shiftedVectors
}

export const SvgView = (props: { graphData: GraphData; children?: React.ReactNode }) => {
    const ref = React.useRef<SVGSVGElement>()
    const click = React.useRef(false)
    const size = props.graphData.getGraphSize()
    const viewBox = React.useRef({ x: 0, y: 0, width: size.x * 0.5, height: size.y * 0.5 })
    const viewBoxRanges = {
        x: { min: 0, max: size.x },
        y: { min: 0, max: size.y },
        width: { min: size.x * 0.3, max: size.x },
        height: { min: size.y * 0.3, max: size.y }
    }

    const moveView = (delta: { x: number; y: number }) => {
        viewBox.current.x = clamp(
            viewBox.current.x - delta.x,
            viewBoxRanges.x.min,
            viewBoxRanges.x.max - viewBox.current.width
        )
        viewBox.current.y = clamp(
            viewBox.current.y - delta.y,
            viewBoxRanges.y.min,
            viewBoxRanges.y.max - viewBox.current.height
        )
        ref.current.setAttribute('viewBox', Object.values(viewBox.current).join(' '))
    }

    const scaleView = (scaleRoot: { x: number; y: number }, multiplier: number) => {
        const factor = Math.min(size.x, size.y) * multiplier
        const ratio = {
            x: ilerp(scaleRoot.x, viewBox.current.x, viewBox.current.x + viewBox.current.width),
            y: ilerp(scaleRoot.y, viewBox.current.y, viewBox.current.y + viewBox.current.height)
        }
        const viewSize = {
            width: clamp(viewBox.current.width - factor, viewBoxRanges.width.min, viewBoxRanges.width.max),
            height: clamp(viewBox.current.height - factor, viewBoxRanges.height.max, viewBoxRanges.height.max)
        }
        if (viewSize.width === viewBox.current.width && viewSize.height === viewBox.current.height) return
        viewBox.current.x = clamp(
            viewBox.current.x + factor * ratio.x,
            viewBoxRanges.x.min,
            viewBoxRanges.x.max - viewSize.width
        )
        viewBox.current.y = clamp(
            viewBox.current.y + factor * ratio.y,
            viewBoxRanges.y.min,
            viewBoxRanges.y.max - viewSize.height
        )
        viewBox.current.width = viewSize.width
        viewBox.current.height = viewSize.height
        ref.current.setAttribute('viewBox', Object.values(viewBox.current).join(' '))
    }

    React.useEffect(() => {
        const interval = setInterval(() => {
            const containerSize = {
                x: ref.current.parentElement.clientWidth,
                y: ref.current.parentElement.clientHeight
            }
            const svgSize = { x: ref.current.clientWidth, y: ref.current.clientHeight }
            if (containerSize.x !== svgSize.x || containerSize.y === svgSize.y) {
                ref.current.setAttribute('width', containerSize.x.toString())
                ref.current.setAttribute('height', containerSize.y.toString())
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [ref])

    return (
        <svg
            ref={ref}
            viewBox={Object.values(viewBox.current).join(' ')}
            preserveAspectRatio='xMidYMid meet'
            onMouseDown={event => (click.current = true)}
            onMouseUp={event => (click.current = false)}
            onMouseLeave={event => (click.current = false)}
            onMouseMove={event => {
                if (!click.current) return
                const screenDelta = { x: event.movementX, y: event.movementY }
                const [svgDelta] = svgScreenTransformVector('toSvg', ref.current, screenDelta)
                moveView(svgDelta)
            }}
            onWheel={event => {
                const screenPoint = { x: event.clientX, y: event.clientY }
                const [svgPoint] = svgScreenTransformPoint('toSvg', ref.current, screenPoint)
                scaleView(svgPoint, event.deltaY < 0 ? 0.02 : -0.02)
            }}
        >
            <g fill='none' stroke='gray' strokeWidth={2} opacity={0.2}>
                <rect width={size.x} height={size.y} />
                <rect x={size.x / 4} y={size.y / 4} width={size.x / 2} height={size.y / 2} />
            </g>
            {props.children}
        </svg>
    )
}
