import * as ace from 'brace'
import * as React from 'react'
import { actions as inputActions } from '../../reducers/input'
import { useDispatch } from '../../reducers/Store'
import { MemoTextEditor } from './TextEditor'

export function InputEditor() {
    const [editor, setEditor] = React.useState<ace.Editor>(undefined)
    const dispatch = useDispatch()

    React.useEffect(() => {
        if (!editor) return
        editor.$blockScrolling = Infinity
        editor.setFontSize('1rem')
        editor.renderer.setShowGutter(false)

        const onChange = (change: ace.EditorChangeEvent) => dispatch(inputActions.set(editor.session.doc.getAllLines()))

        editor.on('change', onChange)
        return () => editor.off('change', onChange)
    }, [editor])

    return <MemoTextEditor onEditorUpdate={setEditor} />
}
