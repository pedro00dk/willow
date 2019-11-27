import ace from 'brace'
import React from 'react'
import { useSelection } from '../../reducers/Store'
import { TextEditor } from './TextEditor'

export const OutputEditor = () => {
    const [editor, setEditor] = React.useState<ace.Editor>()
    const { tracer } = useSelection(state => ({ tracer: state.tracer }))

    const outputs = React.useMemo(() => {
        if (!tracer.available) return []
        let previous = ''
        return tracer.steps.map(
            ({ prints, threw }) =>
                (previous = `${previous}${threw?.cause ?? threw?.exception.traceback ?? ''}${prints ?? ''}`)
        )
    }, [tracer.available])

    React.useEffect(() => {
        if (!editor) return
        editor.renderer.setShowGutter(false)
        editor.setReadOnly(true)
    }, [editor])

    React.useEffect(() => {
        if (!editor || !tracer.available) return
        editor.session.doc.setValue(outputs[tracer.index])
        editor.scrollToLine(editor.session.getLength(), true, true, undefined)
    }, [editor, tracer.available])

    return <TextEditor onEditor={setEditor} />
}
