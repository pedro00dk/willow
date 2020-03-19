import React from 'react'

// Firefox does not provide coordinates in drag operations with the exception of the document element
const isFirefox = typeof (globalThis as any).InstallTrigger !== 'undefined'
const documentPosition = { x: 0, y: 0 }
if (isFirefox) {
    const updateDocumentPosition = (event: DragEvent) => {
        documentPosition.x = event.pageX
        documentPosition.y = event.pageY
    }
    document.addEventListener('dragstart', updateDocumentPosition)
    document.addEventListener('dragover', updateDocumentPosition)
}

export const Draggable = (props: {
    props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
    onDragStart?: (event: React.DragEvent) => void
    onDrag?: (event: React.DragEvent, delta: { x: number; y: number }) => void
    onDragEnd?: (event: React.DragEvent) => void
    children?: React.ReactNode
}) => {
    const anchor = React.useRef({ x: 0, y: 0 })

    return (
        <div
            {...props.props}
            draggable
            onDragStart={event => {
                const image = new Image()
                image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
                event.dataTransfer.setDragImage(image, 0, 0)
                anchor.current = { x: event.pageX, y: event.pageY }
                props.onDragStart?.(event)
            }}
            onDrag={event => {
                const position = !isFirefox ? { x: event.pageX, y: event.pageY } : { ...documentPosition }
                if (position.x === 0 && position.y === 0) return
                const delta = { x: position.x - anchor.current.x, y: position.y - anchor.current.y }
                anchor.current = position
                props.onDrag?.(event, delta)
            }}
            onDragEnd={event => props.onDragEnd?.(event)}
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
