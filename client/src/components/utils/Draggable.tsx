import React from 'react'

export const Draggable = (props: {
    props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
    onDragStart?: (event: React.DragEvent) => void
    onDrag?: (delta: { x: number; y: number }, event: React.DragEvent) => void
    onDragEnd?: (event: React.DragEvent) => void
    children?: React.ReactNode
}) => {
    const anchor = React.useRef<{ x: number; y: number }>()
    const ghostImage = React.useMemo(() => {
        const image = new Image()
        image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
        return image
    }, [])

    return (
        <div
            {...props.props}
            draggable
            onDragStart={event => {
                anchor.current = { x: event.clientX, y: event.clientY }
                event.dataTransfer.setDragImage(ghostImage, 0, 0)
                props.onDragStart?.(event)
            }}
            onDrag={event => {
                if (event.clientX === 0 && event.clientY === 0) return
                const delta = { x: event.clientX - anchor.current.x, y: event.clientY - anchor.current.y }
                anchor.current = { x: event.clientX, y: event.clientY }
                props.onDrag?.(delta, event)
            }}
            onDragEnd={event => {
                anchor.current = undefined
                props.onDragEnd?.(event)
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
