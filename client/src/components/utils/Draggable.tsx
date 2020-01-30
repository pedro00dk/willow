import React from 'react'

export const Draggable = (props: {
    props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
    onDrag: (delta: { x: number; y: number }, event: React.DragEvent) => void
    children?: React.ReactNode
}) => {
    const anchor = React.useRef<{ x: number; y: number }>()
    const ghostImage = React.useMemo(() => {
        const image = new Image()
        image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
        return image
    }, [])
    const eventStopPropagation = React.useCallback((event: React.MouseEvent) => event.stopPropagation(), [])

    return (
        <div
            {...props.props}
            draggable
            onDragStart={event => {
                anchor.current = { x: event.clientX, y: event.clientY }
                event.dataTransfer.setDragImage(ghostImage, 0, 0)
            }}
            onDrag={event => {
                if (event.clientX === 0 && event.clientY === 0) return
                const delta = { x: event.clientX - anchor.current.x, y: event.clientY - anchor.current.y }
                anchor.current = { x: event.clientX, y: event.clientY }
                props.onDrag(delta, event)
            }}
            onDragEnd={event => (anchor.current = undefined)}
            onMouseDown={eventStopPropagation}
            onMouseUp={eventStopPropagation}
            onMouseEnter={eventStopPropagation}
            onMouseLeave={eventStopPropagation}
            onMouseMove={eventStopPropagation}
        >
            {props.children}
        </div>
    )
}
