import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { default as ReactSplitPane, Props as ReactSplitPaneProps } from 'react-split-pane'
import { colors } from '../colors'

const classes = {
    container: cn('position-relative', 'd-flex'),
    pane: cn('position-relative', 'd-flex'),
    resizer: {
        base: cn(
            css({
                background: colors.gray.dark,
                backgroundClip: 'padding-box',
                opacity: 0.25,
                zIndex: 10,
                transition: 'all 0.25s ease'
            })
        ),
        horizontal: cn(
            css({
                width: '100%',
                height: 12,
                borderTop: '4px solid transparent',
                borderBottom: '4px solid transparent',
                margin: '-4px 0 -4px 0',
                ':hover': {
                    borderTop: `4px solid ${colors.gray.light}`,
                    borderBottom: `4px solid ${colors.gray.light}`,
                    cursor: 'row-resize'
                }
            })
        ),
        vertical: cn(
            css({
                height: '100%',
                width: 12,
                margin: '0 -4px 0 -4px',
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                ':hover': {
                    borderLeft: `4px solid ${colors.gray.light}`,
                    borderRight: `4px solid ${colors.gray.light}`,
                    cursor: 'col-resize'
                }
            })
        )
    }
}

export function SplitPane(props: {
    split?: ReactSplitPaneProps['split']
    base?: ReactSplitPaneProps['size']
    left?: ReactSplitPaneProps['minSize']
    right?: ReactSplitPaneProps['maxSize']
    children?: React.ReactNode[]
}) {
    return (
        <ReactSplitPane
            className={classes.container}
            resizerClassName={cn(classes.resizer.base, classes.resizer[props.split])}
            split={props.split}
            defaultSize={props.base}
            minSize={props.left}
            maxSize={props.right}
            {...{ paneClassName: classes.pane }}
        >
            {props.children}
        </ReactSplitPane>
    )
}
