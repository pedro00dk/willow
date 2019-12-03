import cn from 'classnames'
import React from 'react'
import { colors } from '../colors'
import { Draggable } from './Draggable'
import { css } from 'emotion'

const classes = {
    container: 'd-flex w-100 h-100',
    dragger: css({ background: colors.gray.light }),
    pane: 'd-flex'
}

const styles = {
    size: (ratio: number, crop: number) => `calc(${(ratio * 100).toFixed(2)}% - ${crop}px)`,
    cursor: (layout: 'row' | 'column') => (layout === 'row' ? 'ew-resize' : 'ns-resize')
}

export const Splitter = (props: {
    direction?: 'row' | 'column'
    baseRatio?: number
    minRatio?: number
    maxRatio?: number
    resizable?: boolean
    draggerSize?: number
    draggerClassName?: string
    paneClassName?: string
    className?: string
    children?: [React.ReactNode, React.ReactNode]
}) => {
    const {
        direction = 'row',
        baseRatio = 0.5,
        minRatio = 0.2,
        maxRatio = 0.8,
        resizable = true,
        draggerSize = 4,
        draggerClassName,
        paneClassName,
        className,
        children
    } = props
    const ref = React.useRef<HTMLDivElement>()
    const [ratio, setRatio] = React.useState(Math.min(Math.max(baseRatio, minRatio), maxRatio))
    const varyingAxis = direction === 'row' ? 'width' : 'height'
    const pinnedAxis = direction === 'row' ? 'height' : 'width'

    return (
        <div ref={ref} className={cn(classes.container, `flex-${direction}`, className)}>
            <div
                className={cn(classes.pane, paneClassName)}
                style={{ [pinnedAxis]: '100%', [varyingAxis]: styles.size(ratio, draggerSize / 2) }}
            >
                {children[0]}
            </div>
            <Draggable
                props={{
                    className: cn(classes.dragger, draggerClassName),
                    style: { [pinnedAxis]: '100%', [varyingAxis]: draggerSize, cursor: styles.cursor(direction) }
                }}
                onDrag={delta => {
                    if (!resizable) return
                    const rect = ref.current.getBoundingClientRect()
                    const change = direction === 'row' ? delta.x / rect.width : delta.y / rect.height
                    setRatio(Math.min(Math.max(ratio + change, minRatio), maxRatio))
                }}
            />
            <div
                className={cn(classes.pane, paneClassName)}
                style={{ [pinnedAxis]: '100%', [varyingAxis]: styles.size(1 - ratio, draggerSize / 2) }}
            >
                {children[1]}
            </div>
        </div>
    )
}
