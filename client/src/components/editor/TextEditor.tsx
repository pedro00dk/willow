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

    React.useEffect(() => {
        const editor = ace.edit(ref.current)
        if (props.onEditor) props.onEditor(editor)
        editor.setFontSize(classes.font)
        editor.$blockScrolling = Infinity

        const size = { x: ref.current.clientWidth, y: ref.current.clientHeight }

        const interval = setInterval(() => {
            if (size.x === ref.current.clientWidth && size.y === ref.current.clientHeight) return
            size.x = ref.current.clientWidth
            size.y = ref.current.clientHeight
            editor.resize()
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return <div ref={ref} className={classes.container} />
})
