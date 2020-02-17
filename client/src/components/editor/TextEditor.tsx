import ace from 'brace'
import React from 'react'

const classes = {
    container: 'd-flex w-100 h-100',
    font: '1rem'
}

export type EditorMarker = { id: number; inFront: boolean; clazz: string; type: string; range: ace.Range }

export const Range = ace.acequire('ace/range').Range as new (r: number, c: number, er: number, ec: number) => ace.Range

export const TextEditor = (props: { onEditor?: (editor: ace.Editor) => void }) => {
    const container$ = React.useRef<HTMLDivElement>()
    const editor = React.useRef<ace.Editor>()

    React.useLayoutEffect(() => {
        editor.current = ace.edit(container$.current)
        editor.current.setFontSize(classes.font)
        editor.current.$blockScrolling = Infinity
        props.onEditor?.(editor.current)
    }, [container$.current])

    React.useLayoutEffect(() => {
        const size = { width: container$.current.clientWidth, height: container$.current.clientHeight }

        const onResize = (event: Event) => {
            if (size.width === container$.current.clientWidth && size.height === container$.current.clientHeight) return
            size.width = container$.current.clientWidth
            size.height = container$.current.clientHeight
            editor.current.resize()
        }

        globalThis.addEventListener('paneResizeEnd', onResize)
        return () => globalThis.removeEventListener('paneResizeEnd', onResize)
    }, [container$.current, editor.current])

    return <div ref={container$} className={classes.container} />
}
