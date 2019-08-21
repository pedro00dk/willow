import cn from 'classnames'
import * as React from 'react'
import { colors } from '../colors'

const classes = {
    container: cn('d-flex', 'w-100 h-100'),
    pane: cn('d-flex')
}

const styles = {
    size: (ratio: number, crop: number) => `calc(${ratio * 100}% - ${crop}px)`,
    cursor: (layout: 'row' | 'column') => (layout === 'row' ? 'ew-resize' : 'ns-resize')
}

export const SplitPane = (props: {
    layout?: 'row' | 'column'
    ratio?: number
    min?: number
    max?: number
    resizable?: boolean
    dragger?: number
    draggerClassName?: string
    draggerStyle?: React.CSSProperties
    paneClassName?: string
    paneStyle?: React.CSSProperties
    className?: string
    style?: React.CSSProperties
    children?: [React.ReactNode, React.ReactNode]
}) => {
    const {
        layout = 'row',
        ratio = 0.5,
        min = 0.2,
        max = 0.8,
        resizable = true,
        dragger = 4,
        draggerClassName,
        draggerStyle = { background: colors.gray.light },
        paneClassName,
        paneStyle,
        className,
        style,
        children
    } = props
    const ref = React.useRef<HTMLDivElement>()
    const firstPaneRef = React.useRef<HTMLDivElement>()
    const secondPaneRef = React.useRef<HTMLDivElement>()
    const [currentRatio, setCurrentRatio] = React.useState(Math.min(Math.max(ratio, min), max))
    const dragAnchor = React.useRef<{ x: number; y: number }>()

    const sizedProperty = layout === 'row' ? 'width' : 'height'
    const fixedProperty = layout === 'row' ? 'height' : 'width'

    return (
        <div ref={ref} className={cn(classes.container, `flex-${props.layout}`, className)} style={style}>
            <div
                ref={firstPaneRef}
                className={cn(classes.pane, paneClassName)}
                style={{
                    ...paneStyle,
                    [fixedProperty]: '100%',
                    [sizedProperty]: styles.size(currentRatio, dragger / 2)
                }}
            >
                {children[0]}
            </div>
            <span
                className={draggerClassName}
                style={{
                    ...draggerStyle,
                    cursor: styles.cursor(layout),
                    [fixedProperty]: '100%',
                    [sizedProperty]: dragger
                }}
                draggable
                onDragStart={event => {
                    dragAnchor.current = { x: event.clientX, y: event.clientY }
                    const ghostImage = new Image()
                    ghostImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
                    event.dataTransfer.setDragImage(ghostImage, 0, 0)
                }}
                onDragEnd={event => (dragAnchor.current = undefined)}
                onDrag={event => {
                    if (!resizable || (event.clientX === 0 && event.clientY === 0)) return
                    const rect = ref.current.getBoundingClientRect()
                    const delta =
                        layout === 'row'
                            ? (event.clientX - dragAnchor.current.x) / rect.width
                            : (event.clientY - dragAnchor.current.y) / rect.height
                    dragAnchor.current = { x: event.clientX, y: event.clientY }
                    setCurrentRatio(Math.min(Math.max(currentRatio + delta, min), max))
                }}
            />
            <div
                ref={secondPaneRef}
                className={cn(classes.pane, paneClassName)}
                style={{
                    ...paneStyle,
                    [fixedProperty]: '100%',
                    [sizedProperty]: styles.size(1 - currentRatio, dragger / 2)
                }}
            >
                {children[1]}
            </div>
        </div>
    )
}
