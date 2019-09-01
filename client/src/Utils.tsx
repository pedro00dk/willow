import * as React from 'react'

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
export const lerp = (ratio: number, from: number, to: number) => from * (1 - ratio) + to * ratio
export const ilerp = (value: number, from: number, to: number) => (value - from) / (to - from)

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

export const Draggable = (props: {
    containerProps: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
    onDrag: (delta: { x: number; y: number }, event?: React.DragEvent) => void
    children?: React.ReactNode
}) => {
    const anchor = React.useRef<{ x: number; y: number }>()

    return (
        <div
            {...props.containerProps}
            draggable
            onDragStart={event => {
                anchor.current = { x: event.clientX, y: event.clientY }
                const emptyGhostImage = new Image()
                emptyGhostImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
                event.dataTransfer.setDragImage(emptyGhostImage, 0, 0)
            }}
            onDragEnd={event => (anchor.current = undefined)}
            onDrag={event => {
                if (event.clientX === 0 && event.clientY === 0) return
                const delta = { x: event.clientX - anchor.current.x, y: event.clientY - anchor.current.y }
                anchor.current = { x: event.clientX, y: event.clientY }
                props.onDrag(delta, event)
            }}
            onMouseDown={event => event.stopPropagation()}
            onMouseUp={event => event.stopPropagation()}
            onMouseEnter={event => event.stopPropagation()}
            onMouseLeave={event => event.stopPropagation()}
            onMouseMove={event => event.stopPropagation()}
        >
            {props.children}
        </div>
    )
}
