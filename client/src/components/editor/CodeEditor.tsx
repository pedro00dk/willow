import * as ace from 'brace'
import { css } from 'emotion'
import * as React from 'react'
import { useDispatch, useRedux } from '../../reducers/Store'
import { MemoTextEditor } from './TextEditor'

type EditorMouseEvent = {
    [props: string]: unknown
    domEvent: MouseEvent
    editor: ace.Editor
    getDocumentPosition: () => ace.Position
}
type EditorGutterLayer = {
    [props: string]: unknown
    $cells: { [props: string]: unknown; element: HTMLDivElement }[]
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

const { Range } = ace.acequire('ace/range') as {
    Range: new (startRow: number, startColumn: number, endRow: number, endColumn: number) => ace.Range
}

const styles = {
    breakpoint: css({ backgroundColor: 'LightCoral' }),
    highlight: css({ position: 'absolute', backgroundColor: 'LightBlue' }),
    warning: css({ position: 'absolute', backgroundColor: 'LightYellow' }),
    error: css({ position: 'absolute', backgroundColor: 'LightCoral' })
}

type Props = {
    mode: 'java' | 'python'
    font?: number
}

export function CodeEditor(props: Props) {
    const dispatch = useDispatch()
    const code = useRedux(state => ({ code: state.code })).code
    const [editor, setEditor] = React.useState<ace.Editor>(undefined)
    React.useEffect(() => {
        if (!editor) return
        editor.$blockScrolling = Infinity
        editor.setTheme('ace/theme/chrome')
        editor.setFontSize(`${props.font ? props.font.toString() : 16}px`)
        editor.setOptions({ enableBasicAutocompletion: true, enableLiveAutocompletion: true, enableSnippets: true })
        editor.session.setMode(`ace/mode/${props.mode}`)

        const onChange = (change: ace.EditorChangeEvent) =>
            dispatch({ type: 'code/setText', payload: { text: editor.session.doc.getAllLines() } })

        const onGutterMouseDown = (event: EditorMouseEvent) => {
            const gutterLayer = (editor.renderer as { [key: string]: unknown })['$gutterLayer'] as EditorGutterLayer
            const region = gutterLayer.getRegion(event)
            if (region !== 'markers') return
            const line = (event.getDocumentPosition() as ace.Position).row
            dispatch({ type: 'code/setBreakpoint', payload: { line } })
        }

        editor.on('change', onChange)
        editor.on('guttermousedown', onGutterMouseDown)
        return () => {
            editor.off('change', onChange)
            editor.off('guttermousedown', onGutterMouseDown)
        }
    }, [editor])
    React.useEffect(() => {
        dispatch({ type: 'code/setLanguage', payload: { language: props.mode } })
    }, [props.mode])
    React.useEffect(() => {
        if (!editor) return
        const decorations = (editor.session as { [key: string]: unknown })['$decorations'] as string[]
        decorations.forEach((decoration, i) => editor.session.removeGutterDecoration(i, styles.breakpoint))
        code.breakpoints.forEach(breakpoint => editor.session.addGutterDecoration(breakpoint, styles.breakpoint))
    }, [code.breakpoints])
    React.useEffect(() => {
        if (!editor) return
        const markers = editor.session.getMarkers(false) as EditorMarker[]
        Object.values(markers)
            .filter(marker => marker.id > 2)
            .forEach(marker => editor.session.removeMarker(marker.id))
        code.markers.forEach(marker =>
            editor.session.addMarker(
                new Range(marker.line, 0, marker.line, Infinity),
                styles[marker.type],
                'fullLine',
                false
            )
        )
    }, [code.markers])

    return <MemoTextEditor onEditorUpdate={setEditor} />
}
