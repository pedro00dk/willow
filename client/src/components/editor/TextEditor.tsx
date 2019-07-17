import * as ace from 'brace'
import cn from 'classnames'
import * as React from 'react'

const classes = {
    container: cn('d-flex', 'w-100 h-100')
}

const styles = {
    font: '1rem'
}

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

export const range = (startRow: number, startColumn: number, endRow: number, endColumn: number): ace.Range =>
    new (ace.acequire('ace/range')).Range(startRow, startColumn, endRow, endColumn)

export const TextEditor = React.memo((props: { onEditor?: (editor: ace.Editor) => void }) => {
    const containerRef = React.useRef<HTMLDivElement>()

    React.useEffect(() => {
        const editor = ace.edit(containerRef.current)
        if (props.onEditor) props.onEditor(editor)
        editor.setFontSize(styles.font)
        editor.$blockScrolling = Infinity

        const size = { width: containerRef.current.clientWidth, height: containerRef.current.clientHeight }

        const interval = window.setInterval(() => {
            if (size.width === containerRef.current.clientWidth && size.height === containerRef.current.clientHeight)
                return
            size.width = containerRef.current.clientWidth
            size.height = containerRef.current.clientHeight
            editor.resize()
        }, 1000)

        return () => window.clearInterval(interval)
    }, [])

    return <div ref={containerRef} className={classes.container} />
})
