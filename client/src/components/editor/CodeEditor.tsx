import * as ace from 'brace'
import { css } from 'emotion'
import * as React from 'react'
import { actions as breakpointsActions } from '../../reducers/breakpoints'
import { actions as codeActions } from '../../reducers/code'
import { MarkerType } from '../../reducers/markers'
import { useDispatch, useRedux } from '../../reducers/Store'
import { MemoTextEditor } from './TextEditor'

import 'brace/ext/language_tools'
import 'brace/ext/searchbox'
import 'brace/mode/java'
import 'brace/mode/python'
import 'brace/mode/text'
import 'brace/theme/chrome'

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

const styles = {
    breakpoint: css({ backgroundColor: 'LightCoral' }),
    [MarkerType.HIGHLIGHT]: css({ position: 'absolute', backgroundColor: 'LightBlue' }),
    [MarkerType.WARNING]: css({ position: 'absolute', backgroundColor: 'LightYellow' }),
    [MarkerType.ERROR]: css({ position: 'absolute', backgroundColor: 'LightCoral' })
}

const { Range } = ace.acequire('ace/range') as {
    Range: new (startRow: number, startColumn: number, endRow: number, endColumn: number) => ace.Range
}

function syntaxSupport(language: string) {
    return new Set(['java', 'python']).has(language) ? `ace/mode/${language}` : 'ace/mode/text'
}

type Props = {
    mode: 'java' | 'python'
    font?: number
}

export function CodeEditor(props: Props) {
    const [editor, setEditor] = React.useState<ace.Editor>(undefined)
    const dispatch = useDispatch()
    const { breakpoints, language, markers } = useRedux(state => ({
        breakpoints: state.breakpoints,
        language: state.language,
        markers: state.markers
    }))

    React.useEffect(() => {
        if (!editor) return
        editor.$blockScrolling = Infinity
        editor.setTheme('ace/theme/chrome')
        editor.setFontSize(`${props.font ? props.font.toString() : 16}px`)
        editor.setOptions({ enableBasicAutocompletion: true, enableLiveAutocompletion: true, enableSnippets: true })

        const onChange = (change: ace.EditorChangeEvent) => dispatch(codeActions.set(editor.session.doc.getAllLines()))

        const onGutterMouseDown = (event: EditorMouseEvent) => {
            const gutterLayer = (editor.renderer as any).$gutterLayer as EditorGutterLayer
            const region = gutterLayer.getRegion(event)
            if (region !== 'markers') return
            const line = (event.getDocumentPosition() as ace.Position).row
            dispatch(breakpointsActions.toggle(line))
        }

        editor.on('change', onChange)
        editor.on('guttermousedown', onGutterMouseDown)

        return () => {
            editor.off('change', onChange)
            editor.off('guttermousedown', onGutterMouseDown)
        }
    }, [editor])

    React.useEffect(() => {
        if (!editor) return
        editor.session.setMode(syntaxSupport(language.languages[language.selected]))
    }, [language.selected])

    React.useEffect(() => {
        if (!editor) return
        const decorations = (editor.session as any).$decorations as string[]
        decorations.forEach((decoration, i) => editor.session.removeGutterDecoration(i, styles.breakpoint))
        breakpoints.lines.forEach(line => editor.session.addGutterDecoration(line, styles.breakpoint))
    }, [breakpoints.lines])

    React.useEffect(() => {
        if (!editor) return
        const aceMarkers = editor.session.getMarkers(false) as EditorMarker[]
        Object.values(aceMarkers)
            .filter(marker => marker.id > 2)
            .forEach(marker => editor.session.removeMarker(marker.id))
        markers.markers.forEach(marker =>
            editor.session.addMarker(new Range(marker.line, 0, marker.line, 1), styles[marker.type], 'fullLine', false)
        )
    }, [markers.markers])

    return <MemoTextEditor onEditorUpdate={setEditor} />
}
