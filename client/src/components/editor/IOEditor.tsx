import * as ace from 'brace'
import * as React from 'react'
import { connect } from 'react-redux'
import { IOState, StoreState, ThunkDispatchProp } from '../../reducers/Store'
import { TextEditor } from './TextEditor'


type EditorExecEvent = {
    [props: string]: unknown
    args: string | { text: string, event: ClipboardEvent }
    command: ace.EditorCommand
    editor: ace.Editor
    preventDefault: () => void
    stopPropagation: () => void
}

type ConnectedIOEditorProps = { io: IOState }
type IOEditorProps = {}
// tslint:disable-next-line:variable-name
export const IOEditor = connect<ConnectedIOEditorProps, {}, IOEditorProps, StoreState>(
    state => ({ io: state.io })
)((props: ThunkDispatchProp & ConnectedIOEditorProps & IOEditorProps) => {
    const [editor, setEditor] = React.useState<ace.Editor>(undefined)
    React.useEffect(
        () => {
            if (!editor) return
            editor.$blockScrolling = Infinity

            const onExec = (event: EditorExecEvent, commandManager: ace.CommandManager) => {
                const command = event.command.name
                if (!new Set(['insertstring', 'paste', 'backspace', 'del', 'cut']).has(command)) return
                const anchor = editor.selection.getSelectionAnchor()
                const lead = editor.selection.getSelectionLead()
                const lastLine = editor.session.getLength() - 1
                if (anchor.row < lastLine || lead.row < lastLine ||
                    event.command.name === 'backspace' && anchor.column === 0 && lead.column === 0) {
                    event.preventDefault()
                    event.stopPropagation()
                }
            }

            (editor.commands as any).on('exec', onExec)
            return () => (editor.commands as any).off('exec', onExec)
        },
        [editor]
    )

    return <TextEditor
        onEditorUpdate={setEditor}
    />
})
