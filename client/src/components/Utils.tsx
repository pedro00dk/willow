import * as React from 'react'

const emptyGhostImage = (() => {
    const emptyGhostImage = new Image()
    emptyGhostImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
    return emptyGhostImage
})()

export const Draggable = (props: {
    containerProps: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
    showGhost: boolean
    onDrag: (deltaVector: { x: number; y: number }) => void
    children?: React.ReactNode
}) => {
    const anchor = React.useRef<{ x: number; y: number }>()

    return (
        <div
            {...props.containerProps}
            draggable
            onDragStart={event => {
                anchor.current = { x: event.clientX, y: event.clientY }
                if (props.showGhost) return
                event.dataTransfer.setDragImage(emptyGhostImage, 0, 0)
            }}
            onDragEnd={event => (anchor.current = undefined)}
            onDrag={event => {
                if (event.clientX === 0 && event.clientY === 0) return
                const deltaVector = { x: event.clientX - anchor.current.x, y: event.clientY - anchor.current.y }
                anchor.current = { x: event.clientX, y: event.clientY }
                props.onDrag(deltaVector)
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
