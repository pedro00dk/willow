import cn from 'classnames'
import * as React from 'react'
import { colors } from '../colors'
import { Draggable } from './Utils'

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
    const sizedProperty = layout === 'row' ? 'width' : 'height'
    const fixedProperty = layout === 'row' ? 'height' : 'width'

    return (
        <div ref={ref} className={cn(classes.container, `flex-${props.layout}`, className)} style={style}>
            <div
                className={cn(classes.pane, paneClassName)}
                style={{
                    ...paneStyle,
                    [fixedProperty]: '100%',
                    [sizedProperty]: styles.size(ratio, dragger / 2)
                }}
            >
                {children[0]}
            </div>
            <Draggable
                containerProps={{
                    className: draggerClassName,
                    style: {
                        ...draggerStyle,
                        cursor: styles.cursor(layout),
                        [fixedProperty]: '100%',
                        [sizedProperty]: dragger
                    }
                }}
                showGhost={false}
                onDrag={deltaVector => {
                    if (!resizable) return
                    const rect = ref.current.getBoundingClientRect()
                    const delta = layout === 'row' ? deltaVector.x / rect.width : deltaVector.y / rect.height
                    setRatio(Math.min(Math.max(ratio + delta, min), max))
                }}
            />
            <div
                className={cn(classes.pane, paneClassName)}
                style={{
                    ...paneStyle,
                    [fixedProperty]: '100%',
                    [sizedProperty]: styles.size(1 - ratio, dragger / 2)
                }}
            >
                {children[1]}
            </div>
        </div>
    )
}
