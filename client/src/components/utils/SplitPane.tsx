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
    const container$ = React.useRef<HTMLDivElement>()
    const firstPane$ = React.useRef<HTMLDivElement>()
    const secondPane$ = React.useRef<HTMLDivElement>()
    const ratio = React.useRef(Math.min(Math.max(initialRatio, range[0]), range[1]))
    const variableSize = orientation === 'row' ? 'width' : 'height'
    const fixedSize = orientation === 'row' ? 'height' : 'width'

    return (
        <div ref={container$} className={classes.container} style={{ flexDirection: orientation }}>
            <div
                ref={firstPane$}
                className={classes.pane}
                style={{ [fixedSize]: '100%', [variableSize]: styles.size(ratio.current, draggerSize / 2) }}
            >
                {children[0]}
            </div>
            <Draggable
                props={{
                    className: classes.dragger,
                    style: { [fixedSize]: '100%', [variableSize]: draggerSize, cursor: styles.cursor(orientation) }
                }}
                onDrag={delta => {
                    const rect = container$.current.getBoundingClientRect()
                    const change = orientation === 'row' ? delta.x / rect.width : delta.y / rect.height
                    ratio.current = Math.min(Math.max(ratio.current + change, range[0]), range[1])
                    firstPane$.current.style[variableSize] = styles.size(ratio.current, draggerSize / 2)
                    secondPane$.current.style[variableSize] = styles.size(1 - ratio.current, draggerSize / 2)
                }}
            />
            <div
                ref={secondPane$}
                className={classes.pane}
                style={{ [fixedSize]: '100%', [variableSize]: styles.size(1 - ratio.current, draggerSize / 2) }}
            >
                {children[1]}
            </div>
        </div>
    )
}
