import ace from 'brace'
import React from 'react'

export type EditorMouseEvent = {
    [props: string]: unknown
    domEvent: MouseEvent
    editor: ace.Editor
    getDocumentPosition: () => ace.Position
}

export type EditorGutterLayer = {
    [props: string]: unknown
    $cells: { [props: string]: unknown; element: HTMLElement }[]
    element: HTMLElement
    getRegion: (event: EditorMouseEvent) => 'foldWidgets' | 'markers'
}

export type EditorMarker = {
    id: number
    inFront: boolean
    clazz: string
    type: string
    renderer: unknown
    range: ace.Range
}

const classes = {
    container: 'd-flex w-100 h-100',
    font: '1rem'
}

const AceRange = ace.acequire('ace/range').Range

export const range = (startRow: number, startColumn: number, endRow: number, endColumn: number): ace.Range =>
    new AceRange(startRow, startColumn, endRow, endColumn)

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

        const onResize = (event: UIEvent) => {
            if (size.width === container$.current.clientWidth && size.height === container$.current.clientHeight) return
            size.width = container$.current.clientWidth
            size.height = container$.current.clientHeight
            editor.current.resize()
        }

        globalThis.addEventListener('resize', onResize)
        return () => globalThis.removeEventListener('resize', onResize)
    }, [container$.current, editor.current])

    return <div ref={container$} className={classes.container} />
}
