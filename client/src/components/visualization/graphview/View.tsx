import React from 'react'

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

export const View = (props: { size: { x: number; y: number }; children?: React.ReactNode }) => {
    const ref = React.useRef<HTMLDivElement>()
    const svgRef = React.useRef<SVGSVGElement>()
    const click = React.useRef(false)
    const viewBox = React.useRef([0, 0, props.size.x * 0.5, props.size.y * 0.5])
    const ranges = [
        [0, props.size.x],
        [0, props.size.y],
        [props.size.x * 0.3, props.size.x],
        [props.size.y * 0.3, props.size.y]
    ]

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
    const ilerp = (value: number, from: number, to: number) => (value - from) / (to - from)

    const move = (delta: { x: number; y: number }) => {
        viewBox.current[0] = clamp(viewBox.current[0] - delta.x, ranges[0][0], ranges[0][1] - viewBox.current[2])
        viewBox.current[1] = clamp(viewBox.current[1] - delta.y, ranges[1][0], ranges[1][1] - viewBox.current[3])
        svgRef.current.setAttribute('viewBox', viewBox.current.join(' '))
    }

    const scale = (root: { x: number; y: number }, multiplier: number) => {
        const factor = Math.min(props.size.x, props.size.y) * multiplier
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

    React.useLayoutEffect(() => {
        const containerSize = { x: ref.current.clientWidth, y: ref.current.clientHeight }
        const svgSize = { x: svgRef.current.clientWidth, y: svgRef.current.clientHeight }
        if (containerSize.x !== svgSize.x || containerSize.y === svgSize.y) {
            svgRef.current.setAttribute('width', containerSize.x.toString())
            svgRef.current.setAttribute('height', containerSize.y.toString())
        }

        const interval = setInterval(() => {
            containerSize.x = ref.current.clientWidth
            containerSize.y = ref.current.clientHeight
            svgSize.x = svgRef.current.clientWidth
            svgSize.y = svgRef.current.clientHeight
            if (containerSize.x === svgSize.x && containerSize.y === svgSize.y) return
            svgRef.current.setAttribute('width', containerSize.x.toString())
            svgRef.current.setAttribute('height', containerSize.y.toString())
        }, 1000)

        return () => clearInterval(interval)
    }, [ref, svgRef])

    return (
        <div ref={ref} className={classes.container}>
            <svg
                ref={svgRef}
                viewBox={viewBox.current.join(' ')}
                preserveAspectRatio='xMidYMid meet'
                onMouseDown={event => (click.current = true)}
                onMouseUp={event => (click.current = false)}
                onMouseLeave={event => (click.current = false)}
                onMouseMove={event => {
                    if (!click.current) return
                    const screenDelta = { x: event.movementX, y: event.movementY }
                    const [svgDelta] = svgScreenTransformVector('toSvg', svgRef.current, screenDelta)
                    move(svgDelta)
                }}
                onWheel={event => {
                    const screenPoint = { x: event.clientX, y: event.clientY }
                    const [svgPoint] = svgScreenTransformPoint('toSvg', svgRef.current, screenPoint)
                    scale(svgPoint, event.deltaY < 0 ? 0.02 : -0.02)
                }}
            >
                <g fill='none' stroke='gray' strokeWidth={2} opacity={0.2}>
                    <rect width={props.size.x} height={props.size.y} />
                    <rect
                        x={props.size.x / 4}
                        y={props.size.y / 4}
                        width={props.size.x / 2}
                        height={props.size.y / 2}
                    />
                </g>
                {props.children}
            </svg>
        </div>
    )
}
