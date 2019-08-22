import * as ace from 'brace'
import * as React from 'react'
import { useRedux } from '../../reducers/Store'
import { TextEditor } from './TextEditor'

export const OutputEditor = () => {
    const [editor, setEditor] = React.useState<ace.Editor>()
    const { tracer } = useRedux(state => ({ tracer: state.tracer }))

    React.useEffect(() => {
        if (!editor) return
        editor.renderer.setShowGutter(false)
        editor.setReadOnly(true)
    }, [editor])

    React.useEffect(() => {
        if (!editor || !tracer.available) return
        editor.session.doc.setValue(tracer.outputs[tracer.index])
        editor.scrollToLine(editor.session.getLength(), true, true, undefined)
    }, [editor, tracer])

    return <TextEditor onEditor={setEditor} />
}
