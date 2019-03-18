import * as ace from 'brace'
import * as React from 'react'

import 'brace/ext/language_tools'
import 'brace/ext/searchbox'
import 'brace/mode/java'
import 'brace/mode/python'
import 'brace/mode/text'
import 'brace/theme/chrome'

type Props = {
    onEditorUpdate?: (editor: ace.Editor) => void
}
// tslint:disable-next-line: variable-name
export const MemoTextEditor = React.memo(TextEditor)
export function TextEditor(props: Props) {
    const editorRef = React.useRef<HTMLDivElement>(undefined)
    const [editor, setEditor] = React.useState<ace.Editor>(undefined)
    React.useEffect(() => {
        if (!editorRef.current) return
        const editor = ace.edit(editorRef.current)
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
        }, 2000)
        return () => window.clearInterval(checkResizeInterval)
    }, [editorRef])
    React.useEffect(() => (editor ? props.onEditorUpdate(editor) : undefined), [editor])

    return <div ref={editorRef} className='w-100 h-100' />
}
