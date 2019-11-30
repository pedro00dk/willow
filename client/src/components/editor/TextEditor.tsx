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

export const range = (startRow: number, startColumn: number, endRow: number, endColumn: number): ace.Range =>
    new (ace.acequire('ace/range').Range)(startRow, startColumn, endRow, endColumn)

export const TextEditor = React.memo((props: { onEditor?: (editor: ace.Editor) => void }) => {
    const ref = React.useRef<HTMLDivElement>()
    const editor = React.useRef<ace.Editor>()

    React.useEffect(() => {
        const size = { x: ref.current.clientWidth, y: ref.current.clientHeight }

        const interval = setInterval(() => {
            if (size.x === ref.current.clientWidth && size.y === ref.current.clientHeight) return
            size.x = ref.current.clientWidth
            size.y = ref.current.clientHeight
            editor.current.resize()
        }, 1000)

        return () => clearInterval(interval)
    }, [ref, editor.current])

    return (
        <div
            ref={r => {
                if (!r) return
                ref.current = r
                editor.current = ace.edit(ref.current)
                editor.current.setFontSize(classes.font)
                editor.current.$blockScrolling = Infinity
                props.onEditor?.(editor.current)
            }}
            className={classes.container}
        />
    )
})
