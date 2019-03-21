import * as ace from 'brace'
import * as React from 'react'
import { useDispatch, useRedux } from '../../reducers/Store'
import { TextEditor } from './TextEditor'

type EditorExecEvent = {
    [props: string]: unknown
    args: string | { text: string; event: ClipboardEvent }
    command: ace.EditorCommand
    editor: ace.Editor
    preventDefault: () => void
    stopPropagation: () => void
}

export function IOEditor() {
    const [editor, setEditor] = React.useState<ace.Editor>(undefined)
    const dispatch = useDispatch()
    const { io } = useRedux(state => ({ io: state.io }))
    React.useEffect(() => {
        if (!editor) return
        editor.$blockScrolling = Infinity

        const onExec = (event: EditorExecEvent, commandManager: ace.CommandManager) => {
            if (event.command.readOnly) return
            const anchor = editor.selection.getSelectionAnchor()
            const lead = editor.selection.getSelectionLead()
            const lastLine = editor.session.getLength() - 1
            if (
                anchor.row < lastLine ||
                lead.row < lastLine ||
                (event.command.name === 'backspace' && anchor.column === 0 && lead.column === 0)
            ) {
                event.preventDefault()
                event.stopPropagation()
            }
        }
        const onChange = (change: ace.EditorChangeEvent) =>
            dispatch({
                type: 'io/setInput',
                payload: { input: editor.session.getLine(editor.session.getLength() - 1) }
            })
        ;(editor.commands as any).on('exec', onExec)
        // editor.on('change', onChange)
        return () => (editor.commands as any).off('exec', onExec)
    }, [editor])
    React.useEffect(() => {
        if (!editor) return
        editor.session.doc.setValue(`${io.content.join('')}\n${io.input}`)
    }, [io])
    return <TextEditor onEditorUpdate={setEditor} />
}
