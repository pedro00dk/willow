import React from 'react'

// Firefox trash does not provide coordinates in drag operations with the exception of ondragover
const isFirefox = typeof (globalThis as any).InstallTrigger !== 'undefined'
let documentPosition = { x: 0, y: 0 }
if (isFirefox) document.addEventListener('dragover', event => (documentPosition = { x: event.pageX, y: event.pageY }))

export const Draggable = (props: {
    props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
    onDragStart?: (event: React.DragEvent) => void
    onDrag?: (event: React.DragEvent, delta: { x: number; y: number }) => void
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
                anchor.current = !isFirefox ? { x: event.pageX, y: event.pageY } : documentPosition
                event.dataTransfer.setDragImage(ghostImage, 0, 0)
                props.onDragStart?.(event)
            }}
            onDrag={event => {
                const position = !isFirefox ? { x: event.pageX, y: event.pageY } : documentPosition
                if (!isFirefox && position.x === 0 && position.y === 0) return
                if (isFirefox && anchor.current.x === 0 && anchor.current.y === 0) return (anchor.current = position)
                const delta = { x: position.x - anchor.current.x, y: position.y - anchor.current.y }
                anchor.current = position
                props.onDrag?.(event, delta)
            }}
            onDragEnd={event => (anchor.current = undefined)}
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
