import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { default as ReactSplitPane, Props as ReactSplitPaneProps } from 'react-split-pane'

const classes = {
    resizer: css({ background: 'black', backgroundClip: 'padding-box', opacity: 0.15 }),
    resizerHorizontal: css({
        height: 12,
        width: '100%',
        margin: '-4px 0 -4px 0',
        borderTop: '4px solid white',
        borderBottom: '4px solid white'
    }),
    resizerVertical: css({
        height: '100%',
        width: 12,
        margin: '0 -4px 0 -4px',
        borderLeft: '4px solid white',
        borderRight: '4px solid white'
    }),
    resizerHover: css({ ':hover': { transition: 'all 0.5s ease' } }),
    resizerHorizontalHover: css({
        ':hover': { borderTop: '4px solid gray', borderBottom: '4px solid gray', cursor: 'row-resize' }
    }),
    resizerVerticalHover: css({
        ':hover': { borderLeft: '4px solid gray', borderRight: '4px solid gray', cursor: 'col-resize' }
    })
}

type Props = {
    className?: ReactSplitPaneProps['className']
    resizable?: ReactSplitPaneProps['allowResize']
    split?: ReactSplitPaneProps['split']
    base?: ReactSplitPaneProps['size']
    left?: ReactSplitPaneProps['minSize']
    right?: ReactSplitPaneProps['maxSize']
    children?: JSX.Element[]
}

export function SplitPane(props: Props) {
    return (
        <ReactSplitPane
            className={props.className}
            resizerClassName={cn(
                classes.resizer,
                props.resizable ? classes.resizerHover : undefined,
                props.split === 'vertical'
                    ? [classes.resizerVertical, props.resizable ? classes.resizerVerticalHover : undefined]
                    : [classes.resizerHorizontal, props.resizable ? classes.resizerHorizontalHover : undefined]
            )}
            split={props.split}
            allowResize={props.resizable}
            defaultSize={props.base}
            minSize={props.left}
            maxSize={props.right}
            {...{ paneClassName: 'd-flex' } as any}
        >
            {props.children}
        </ReactSplitPane>
    )
}
