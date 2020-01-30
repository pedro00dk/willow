import { css } from 'emotion'
import React from 'react'
import { colors } from '../../colors'
import { Draggable } from './Draggable'

const classes = {
    container: 'd-flex w-100 h-100',
    pane: 'd-flex',
    dragger: css({ background: colors.gray.light })
}

const styles = {
    size: (ratio: number, crop: number) => `calc(${(ratio * 100).toFixed(2)}% - ${crop}px)`,
    cursor: (layout: 'row' | 'column') => (layout === 'row' ? 'ew-resize' : 'ns-resize')
}

export const SplitPane = (props: {
    orientation?: 'row' | 'column'
    ratio?: number
    range?: [number, number]
    draggerSize?: number
    children?: [React.ReactNode, React.ReactNode]
}) => {
    const { orientation = 'row', ratio: initialRatio = 0.5, range = [0.2, 0.8], draggerSize = 6, children } = props
    const ref = React.useRef<HTMLDivElement>()
    const [ratio, setRatio] = React.useState(Math.min(Math.max(initialRatio, range[0]), range[1]))
    const variableSize = orientation === 'row' ? 'width' : 'height'
    const fixedSize = orientation === 'row' ? 'height' : 'width'

    return (
        <div ref={ref} className={classes.container} style={{ flexDirection: orientation }}>
            <div
                className={classes.pane}
                style={{ [fixedSize]: '100%', [variableSize]: styles.size(ratio, draggerSize / 2) }}
            >
                {children[0]}
            </div>
            <Draggable
                props={{
                    className: classes.dragger,
                    style: { [fixedSize]: '100%', [variableSize]: draggerSize, cursor: styles.cursor(orientation) }
                }}
                onDrag={delta => {
                    const rect = ref.current.getBoundingClientRect()
                    const change = orientation === 'row' ? delta.x / rect.width : delta.y / rect.height
                    setRatio(Math.min(Math.max(ratio + change, range[0]), range[1]))
                }}
            />
            <div
                className={classes.pane}
                style={{ [fixedSize]: '100%', [variableSize]: styles.size(1 - ratio, draggerSize / 2) }}
            >
                {children[1]}
            </div>
        </div>
    )
}
