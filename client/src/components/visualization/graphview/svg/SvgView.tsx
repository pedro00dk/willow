import React from 'react'

export const lerp = (from: number, to: number, gradient: number) => from * (1 - gradient) + to * gradient

export const ilerp = (value: number, from: number, to: number) => (value - from) / (to - from)

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

export const SvgView = (props: { size: { width: number; height: number }; children?: React.ReactNode }) => {
    const container$ = React.useRef<SVGSVGElement>()
    const click = React.useRef(false)
    const box = React.useRef({ x: 0, y: 0, width: props.size.width * 0.5, height: props.size.height * 0.5 })
    const ranges = {
        x: { min: 0, max: props.size.width },
        y: { min: 0, max: props.size.height },
        width: { min: props.size.width * 0.3, max: props.size.width },
        height: { min: props.size.height * 0.3, max: props.size.height }
    }

    const translateBox = (delta: { x: number; y: number }) => {
        box.current.x = Math.min(Math.max(box.current.x - delta.x, ranges.x.min), ranges.x.max - box.current.width)
        box.current.y = Math.min(Math.max(box.current.y - delta.y, ranges.y.min), ranges.y.max - box.current.height)
        container$.current.setAttribute('viewBox', Object.values(box.current).join(' '))
    }

    const scaleBox = (point: { x: number; y: number }, direction: 'in' | 'out') => {
        const factor = (box.current.width / props.size.width) * (direction === 'in' ? 50 : -50)
        const ratio = {
            x: ilerp(point.x, box.current.x, box.current.x + box.current.width),
            y: ilerp(point.y, box.current.y, box.current.y + box.current.height)
        }
        const size = {
            width: Math.min(Math.max(box.current.width - factor, ranges.width.min), ranges.width.max),
            height: Math.min(Math.max(box.current.height - factor, ranges.height.min), ranges.height.max)
        }
        if (size.width === box.current.width && size.height === box.current.height) return
        box.current.x = Math.min(Math.max(box.current.x + factor * ratio.x, ranges.x.min), ranges.x.max - size.width)
        box.current.y = Math.min(Math.max(box.current.y + factor * ratio.y, ranges.y.min), ranges.y.max - size.height)
        box.current.width = size.width
        box.current.height = size.height
        container$.current.setAttribute('viewBox', Object.values(box.current).join(' '))

        console.log(factor)
    }

    React.useLayoutEffect(() => {
        const onResize = async (event?: UIEvent) => {
            await undefined
            const parentSize = {
                width: container$.current.parentElement.clientWidth,
                height: container$.current.parentElement.clientHeight
            }
            const size = {
                width: container$.current.clientWidth,
                height: container$.current.clientHeight
            }
            if (size.width === parentSize.width && size.height === parentSize.height) return
            container$.current.style.width = `${parentSize.width - 1}px`
            container$.current.style.height = `${parentSize.height - 1}px`
        }

        onResize()
        globalThis.addEventListener('resize', onResize)
        return () => globalThis.removeEventListener('resize', onResize)
    }, [container$])

    return (
        <svg
            ref={container$}
            viewBox={Object.values(box.current).join(' ')}
            preserveAspectRatio='xMidYMid meet'
            onMouseDown={event => (click.current = true)}
            onMouseUp={event => (click.current = false)}
            onMouseLeave={event => (click.current = false)}
            onMouseMove={event => {
                if (!click.current) return
                const screenDelta = { x: event.movementX, y: event.movementY }
                const [svgDelta] = svgScreenTransformVector('toSvg', container$.current, screenDelta)
                translateBox(svgDelta)
            }}
            onWheel={event => {
                const screenPoint = { x: event.clientX, y: event.clientY }
                const [svgPoint] = svgScreenTransformPoint('toSvg', container$.current, screenPoint)
                scaleBox(svgPoint, event.deltaY < 0 ? 'in' : 'out')
            }}
        >
            <g fill='none' stroke='gray' strokeWidth={2} opacity={0.2}>
                <rect width={props.size.width} height={props.size.height} />
                <rect
                    x={props.size.width / 4}
                    y={props.size.height / 4}
                    width={props.size.width / 2}
                    height={props.size.height / 2}
                />
            </g>
            {props.children}
        </svg>
    )
}
