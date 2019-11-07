import * as React from 'react'

const classes = {
    container: 'd-flex w-100 h-100'
}

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

export const View = (props: { children?: React.ReactNode }) => {
    const ref = React.useRef<HTMLDivElement>()
    const svgRef = React.useRef<SVGSVGElement>()
    const click = React.useRef(false)
    const [size, setSize] = React.useState({ x: 1, y: 1 })
    const viewBox = React.useRef([0, 0, size.x * 0.5, size.y * 0.5])
    const ranges = [[0, size.x], [0, size.y], [size.x * 0.3, size.x], [size.y * 0.3, size.y]]

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
    const ilerp = (value: number, from: number, to: number) => (value - from) / (to - from)

    const moveView = (delta: { x: number; y: number }) => {
        viewBox.current[0] = clamp(viewBox.current[0] - delta.x, ranges[0][0], ranges[0][1] - viewBox.current[2])
        viewBox.current[1] = clamp(viewBox.current[1] - delta.y, ranges[1][0], ranges[1][1] - viewBox.current[3])
        svgRef.current.setAttribute('viewBox', viewBox.current.join(' '))
    }

    // TODO zoom is still a bit buggy
    const scaleView = (root: { x: number; y: number }, multiplier: number) => {
        const factor = Math.min(size.x, size.y) * multiplier
        const ratio = {
            x: ilerp(root.x, viewBox.current[0], viewBox.current[0] + viewBox.current[2]),
            y: ilerp(root.y, viewBox.current[1], viewBox.current[1] + viewBox.current[3])
        }
        const viewSize = {
            x: clamp(viewBox.current[2] - factor, ranges[2][0], ranges[2][1]),
            y: clamp(viewBox.current[3] - factor, ranges[3][0], ranges[3][1])
        }
        if (viewSize.x === viewBox.current[2] && viewSize.y === viewBox.current[3]) return
        viewBox.current[0] = clamp(viewBox.current[0] + factor * ratio.x, ranges[0][0], ranges[0][1] - viewSize.x)
        viewBox.current[1] = clamp(viewBox.current[1] + factor * ratio.y, ranges[1][0], ranges[1][1] - viewSize.y)
        viewBox.current[2] = viewSize.x
        viewBox.current[3] = viewSize.y
        svgRef.current.setAttribute('viewBox', viewBox.current.join(' '))
    }

    // recomputes viewBox TODO think a better way
    if (svgRef.current) scaleView({ x: 0, y: 0 }, 0)

    React.useLayoutEffect(() => {
        if (size.x !== ref.current.clientWidth || size.y !== ref.current.clientHeight)
            setSize({ x: ref.current.clientWidth, y: ref.current.clientHeight })

        const interval = setInterval(() => {
            if (size.x === ref.current.clientWidth && size.y === ref.current.clientHeight) return
            setSize({ x: ref.current.clientWidth, y: ref.current.clientHeight })
        }, 1000)

        return () => clearInterval(interval)
    }, [ref, svgRef, size])

    return (
        <div ref={ref} className={classes.container}>
            <svg
                ref={svgRef}
                width={size.x}
                height={size.y}
                viewBox={viewBox.current.join(' ')}
                onMouseDown={event => (click.current = true)}
                onMouseUp={event => (click.current = false)}
                onMouseLeave={event => (click.current = false)}
                onMouseMove={event => {
                    if (!click.current) return
                    const screenDelta = { x: event.movementX, y: event.movementY }
                    const [svgDelta] = svgScreenTransformVector('toSvg', svgRef.current, screenDelta)
                    moveView(svgDelta)
                }}
                onWheel={event => {
                    const screenPoint = { x: event.clientX, y: event.clientY }
                    const [svgPoint] = svgScreenTransformPoint('toSvg', svgRef.current, screenPoint)
                    scaleView(svgPoint, event.deltaY < 0 ? 0.02 : -0.02)
                }}
            >
                <g fill='none' stroke='gray' strokeWidth={2} opacity={0.2}>
                    <rect width={size.x} height={size.y} />
                    <rect x={size.x / 4} y={size.y / 4} width={size.x / 2} height={size.y / 2} />
                </g>
                {props.children}
            </svg>
        </div>
    )
}
