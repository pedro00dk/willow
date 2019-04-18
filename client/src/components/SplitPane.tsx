import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { default as ReactSplitPane, Props as ReactSplitPaneProps } from 'react-split-pane'

const classes = {
    container: 'd-flex position-relative',
    pane: 'd-flex position-relative',
    resizer: {
        base: cn(
            'bg-secondary',
            css({ backgroundClip: 'padding-box', opacity: 0.25, zIndex: 10, transition: 'all 0.25s ease' })
        ),
        horizontal: css({
            height: 12,
            width: '100%',
            margin: '-4px 0 -4px 0',
            borderTop: '4px solid transparent',
            borderBottom: '4px solid transparent',
            ':hover': { borderTop: '4px solid lightgray', borderBottom: '4px solid lightgray', cursor: 'row-resize' }
        }),
        vertical: css({
            height: '100%',
            width: 12,
            margin: '0 -4px 0 -4px',
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            ':hover': { borderLeft: '4px solid lightgray', borderRight: '4px solid lightgray', cursor: 'col-resize' }
        })
    }
}

type Props = {
    split?: ReactSplitPaneProps['split']
    base?: ReactSplitPaneProps['size']
    left?: ReactSplitPaneProps['minSize']
    right?: ReactSplitPaneProps['maxSize']
    children?: React.ReactNode[]
}

export function SplitPane(props: Props) {
    return (
        <ReactSplitPane
            className={classes.container}
            resizerClassName={cn(classes.resizer.base, classes.resizer[props.split])}
            split={props.split}
            defaultSize={props.base}
            minSize={props.left}
            maxSize={props.right}
            {...{ paneClassName: classes.pane } as any}
        >
            {props.children}
        </ReactSplitPane>
    )
}
