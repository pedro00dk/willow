import React from 'react'

export const Draggable = (props: {
    props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
    onDrag?: (delta: { x: number; y: number }, event: React.DragEvent) => void
    children?: React.ReactNode
}) => {
    const anchor = React.useRef<{ x: number; y: number }>()

    return (
        <div
            {...props.props}
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
                if (props.onDrag) props.onDrag(delta, event)
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
