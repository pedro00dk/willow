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

// tslint:disable-next-line: variable-name
export const MemoTextEditor = React.memo(TextEditor)
function TextEditor(props: { onEditor?: (editor: ace.Editor) => void }) {
    const ref = React.useRef<HTMLDivElement>()

    React.useEffect(() => {
        if (!ref.current) return
        const editor = ace.edit(ref.current)
        if (props.onEditor) props.onEditor(editor)
        editor.setFontSize(styles.font)
        editor.$blockScrolling = Infinity

        const size = { width: ref.current.clientWidth, height: ref.current.clientHeight }

        const interval = window.setInterval(() => {
            if (size.width === ref.current.clientWidth && size.height === ref.current.clientHeight) return
            size.width = ref.current.clientWidth
            size.height = ref.current.clientHeight
            editor.resize()
        }, 500)

        return () => window.clearInterval(interval)
    }, [ref])

    return <div ref={ref} className={classes.container} />
}
