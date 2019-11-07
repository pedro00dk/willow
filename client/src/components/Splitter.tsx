import cn from 'classnames'
import React from 'react'
import { colors } from '../colors'
import { Draggable } from './Draggable'

const classes = {
    container: 'd-flex w-100 h-100',
    pane: 'd-flex'
}

const styles = {
    size: (ratio: number, crop: number) => `calc(${(ratio * 100).toFixed(2)}% - ${crop}px)`,
    cursor: (layout: 'row' | 'column') => (layout === 'row' ? 'ew-resize' : 'ns-resize')
}

export const Splitter = (props: {
    layout?: 'row' | 'column'
    base?: number
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
        base = 0.5,
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
    const [ratio, setRatio] = React.useState(Math.min(Math.max(base, min), max))
    const varying = layout === 'row' ? 'width' : 'height'
    const pinned = layout === 'row' ? 'height' : 'width'

    const resize = (delta: { x: number; y: number }) => {
        if (!resizable) return
        const rect = ref.current.getBoundingClientRect()
        const change = layout === 'row' ? delta.x / rect.width : delta.y / rect.height
        setRatio(Math.min(Math.max(ratio + change, min), max))
    }

    return (
        <div ref={ref} className={cn(classes.container, `flex-${layout}`, className)} style={style}>
            <div
                className={cn(classes.pane, paneClassName)}
                style={{ ...paneStyle, [pinned]: '100%', [varying]: styles.size(ratio, dragger / 2) }}
            >
                {children[0]}
            </div>
            <Draggable
                props={{
                    className: draggerClassName,
                    style: { ...draggerStyle, cursor: styles.cursor(layout), [pinned]: '100%', [varying]: dragger }
                }}
                onDrag={delta => resize(delta)}
            />
            <div
                className={cn(classes.pane, paneClassName)}
                style={{ ...paneStyle, [pinned]: '100%', [varying]: styles.size(1 - ratio, dragger / 2) }}
            >
                {children[1]}
            </div>
        </div>
    )
}
