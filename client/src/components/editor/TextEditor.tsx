import * as ace from 'brace'
import cn from 'classnames'
import * as React from 'react'

const classes = {
    container: cn('w-100 h-100')
}

export type EditorMouseEvent = {
    [props: string]: unknown
    domEvent: MouseEvent
    editor: ace.Editor
    getDocumentPosition: () => ace.Position
}

export type EditorGutterLayer = {
    [props: string]: unknown
    $cells: { [props: string]: unknown; element: HTMLDivElement }[]
    element: HTMLDivElement
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

// tslint:disable-next-line: variable-name
export const MemoTextEditor = React.memo(TextEditor)
export function TextEditor(props: { onEditorUpdate?: (editor: ace.Editor) => void }) {
    const editorRef = React.useRef<HTMLDivElement>(undefined)
    const [editor, setEditor] = React.useState<ace.Editor>(undefined)

    React.useEffect(() => {
        if (!editorRef.current) return
        const editor = ace.edit(editorRef.current)
        editor.setFontSize('1rem')
        editor.$blockScrolling = Infinity
        setEditor(editor)
        const parentSize = {
            width: editorRef.current.parentElement.clientWidth,
            height: editorRef.current.parentElement.clientHeight
        }
        const checkResizeInterval = window.setInterval(() => {
            const width = editorRef.current.parentElement.clientWidth
            const height = editorRef.current.parentElement.clientHeight
            if (parentSize.width !== width || parentSize.height !== height) editor.resize()
            parentSize.width = width
            parentSize.height = height
        }, 1000)
        return () => window.clearInterval(checkResizeInterval)
    }, [editorRef])

    React.useEffect(() => {
        if (!editor) return
        props.onEditorUpdate(editor)
    }, [editor])

    return <div ref={editorRef} className={classes.container} />
}
