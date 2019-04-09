import * as ace from 'brace'
import * as React from 'react'
import { useRedux } from '../../reducers/Store'
import { MemoTextEditor } from './TextEditor'

export function OutputEditor() {
    const [editor, setEditor] = React.useState<ace.Editor>(undefined)
    const { debugReference, debugResponse } = useRedux(state => ({
        debugReference: state.debugReference,
        debugResponse: state.debugResponse
    }))

    React.useEffect(() => {
        if (!editor) return
        editor.$blockScrolling = Infinity
        editor.setReadOnly(true)
        editor.setFontSize('1rem')
        editor.renderer.setShowGutter(false)
    }, [editor])

    React.useEffect(() => {
        if (!editor) return
        editor.session.doc.setValue(
            debugResponse.steps
                .filter((step, i) => i > debugReference)
                .flatMap(step => step.prints)
                .join('')
        )
    }, [debugReference, debugResponse])

    return <MemoTextEditor onEditorUpdate={setEditor} />
}
