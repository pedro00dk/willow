import * as ace from 'brace'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { CodeAction, CodeState, StoreState } from '../../reducers/Store'
import { TextEditor } from './TextEditor'


type EditorTextChange = { start: ace.Position, end: ace.Position, action: string, lines: string[] }
type EditorMouseEvent = {
    [props: string]: unknown
    domEvent: MouseEvent
    editor: ace.Editor
    getDocumentPosition: () => ace.Position
}
type EditorGutterLayer = {
    [props: string]: unknown
    $cells: { [props: string]: unknown, element: HTMLDivElement }[]
    element: HTMLDivElement
    getRegion: (event: EditorMouseEvent) => 'foldWidgets' | 'markers'
}

type ConnectedCodeEditorProps = { code: CodeState }
type CodeEditorProps = {
    mode: 'java' | 'python'
    font?: number
}
// tslint:disable-next-line:variable-name
export const CodeEditor = connect<ConnectedCodeEditorProps, {}, CodeEditorProps, StoreState>(
    state => ({ code: state.code })
)(
    (props: DispatchProp & ConnectedCodeEditorProps & CodeEditorProps) => {
        const [editor, setEditor] = React.useState<ace.Editor>(undefined)
        React.useEffect(
            () => {
                if (!editor) return
                editor.$blockScrolling = Infinity
                editor.setTheme('ace/theme/chrome')
                editor.setFontSize(`${props.font ? props.font.toString() : 16}px`)
                editor.setOptions(
                    { enableBasicAutocompletion: true, enableLiveAutocompletion: true, enableSnippets: true }
                )
                editor.session.setMode(`ace/mode/${props.mode}`)

                const onChange = (change: EditorTextChange) =>
                    props.dispatch<CodeAction>({ type: 'code/setText', payload: { text: editor.getValue() } })

                const onGutterMouseDown = (event: EditorMouseEvent) => {
                    const gutterLayer = editor.renderer['$gutterLayer'] as EditorGutterLayer
                    const region = gutterLayer.getRegion(event)
                    if (region !== 'markers') return
                    const line = (event.getDocumentPosition() as ace.Position).row
                    props.dispatch<CodeAction>({ type: 'code/setBreakpoint', payload: { line } })
                }

                editor.on('change', onChange)
                editor.on('guttermousedown', onGutterMouseDown)
                return () => {
                    editor.off('change', onChange)
                    editor.off('guttermousedown', onGutterMouseDown)
                }
            },
            [editor]
        )
        const [previousBreakpoints, setPreviousBreakpoints] = React.useState(props.code.breakpoints)
        React.useEffect(
            () => {
                if (!editor) return
                const gutterLayer = editor.renderer['$gutterLayer'] as EditorGutterLayer
                previousBreakpoints
                    .forEach(breakpoint => gutterLayer.$cells[breakpoint].element.style.backgroundColor = '')
                props.code.breakpoints
                    .forEach(breakpoint => gutterLayer.$cells[breakpoint].element.style.backgroundColor = 'salmon')
                setPreviousBreakpoints(props.code.breakpoints)
            },
            [props.code.breakpoints]
        )

        console.log('code')
        return <TextEditor
            onEditorUpdate={setEditor}
        />
    }
)
