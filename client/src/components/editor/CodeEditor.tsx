import * as ace from 'brace'
import { css } from 'emotion'
import * as React from 'react'
import { connect } from 'react-redux'
import { CodeAction, CodeState, StoreState, ThunkDispatchProp } from '../../reducers/Store'
import { TextEditor } from './TextEditor'


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
type EditorMarker = {
    id: number
    inFront: boolean
    clazz: string
    type: string
    renderer: unknown
    range: ace.Range
}

const { Range } = ace.acequire('ace/range') as
    { Range: new (startRow: number, startColumn: number, endRow: number, endColumn: number) => ace.Range }

type ConnectedCodeEditorProps = { code: CodeState }
type CodeEditorProps = {
    mode: 'java' | 'python'
    font?: number
}
// tslint:disable-next-line:variable-name
export const CodeEditor = connect<ConnectedCodeEditorProps, {}, CodeEditorProps, StoreState>(
    state => ({ code: state.code })
)((props: ThunkDispatchProp & ConnectedCodeEditorProps & CodeEditorProps) => {
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

            const onChange = (change: ace.EditorChangeEvent) =>
                props.dispatch<CodeAction>(
                    { type: 'code/setText', payload: { text: editor.session.doc.getAllLines() } }
                )

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
    React.useEffect(
        () => {
            if (!editor) return
            const breakpointDecoration = css({ backgroundColor: 'LightCoral' })
            const decorations = editor.session['$decorations'] as string[]
            decorations
                .forEach((decoration, index) => editor.session.removeGutterDecoration(index, breakpointDecoration))
            props.code.breakpoints
                .forEach(breakpoint => editor.session.addGutterDecoration(breakpoint, breakpointDecoration))
        },
        [props.code.breakpoints]
    )
    React.useEffect(
        () => {
            if (!editor) return
            const markerHighlightDecoration = css({ position: 'absolute', backgroundColor: 'LightBlue' })
            const markerWarningDecoration = css({ position: 'absolute', backgroundColor: 'LightYellow' })
            const markerErrorDecoration = css({ position: 'absolute', backgroundColor: 'LightCoral' })
            const markers = editor.session.getMarkers(false) as EditorMarker[]

            Object.values(markers)
                .filter(marker => marker.id > 2)
                .forEach(marker => editor.session.removeMarker(marker.id))

            props.code.markers
                .forEach(marker =>
                    editor.session.addMarker(
                        new Range(marker.line, 0, marker.line, Infinity),
                        marker.type === 'highlight'
                            ? markerHighlightDecoration
                            : marker.type === 'warning'
                                ? markerWarningDecoration
                                : markerErrorDecoration
                        ,
                        'fullLine',
                        false
                    )
                )
        },
        [props.code.markers]
    )


    return <TextEditor
        onEditorUpdate={setEditor}
    />
})
