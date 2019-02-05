import * as ace from 'brace'
import * as React from 'react'

import 'brace/ext/language_tools'
import 'brace/ext/searchbox'
import 'brace/mode/java'
import 'brace/mode/python'
import 'brace/mode/text'
import 'brace/theme/chrome'


type EditorProps = {
    onEditorUpdate?: (editor: ace.Editor) => void
}
// tslint:disable-next-line:variable-name
export const TextEditor = React.memo(
    (props: EditorProps) => {
        const editorRef = React.useRef<HTMLDivElement>(undefined)
        const [editor, setEditor] = React.useState<ace.Editor>(undefined)
        React.useEffect(
            () => editorRef.current ? setEditor(ace.edit(editorRef.current)) : undefined,
            [editorRef]
        )
        React.useEffect(
            () => editor ? props.onEditorUpdate(editor) : undefined,
            [editor]
        )

        console.log('text')
        return <div ref={editorRef} className='w-100 h-100' />
    }
)
