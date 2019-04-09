import * as ace from 'brace'
import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../colors'
import * as protocol from '../../protobuf/protocol'
import { actions as breakpointActions } from '../../reducers/breakpoint'
import { actions as codeActions } from '../../reducers/code'
import { useDispatch, useRedux } from '../../reducers/Store'
import { EditorGutterLayer, EditorMarker, EditorMouseEvent, MemoTextEditor } from './TextEditor'

import 'brace/ext/language_tools'
import 'brace/ext/searchbox'
import 'brace/mode/java'
import 'brace/mode/python'
import 'brace/mode/text'
import 'brace/theme/chrome'

const classes = {
    breakpoint: css({ backgroundColor: colors.error }),
    [protocol.Frame.Type.LINE]: cn('position-absolute', css({ backgroundColor: colors.highlight1 })),
    [protocol.Frame.Type.CALL]: cn('position-absolute', css({ backgroundColor: colors.highlight1 })),
    [protocol.Frame.Type.RETURN]: cn('position-absolute', css({ backgroundColor: colors.highlight1 })),
    [protocol.Frame.Type.EXCEPTION]: cn('position-absolute', css({ backgroundColor: colors.error }))
}

const { Range } = ace.acequire('ace/range') as {
    Range: new (startRow: number, startColumn: number, endRow: number, endColumn: number) => ace.Range
}

function syntaxSupport(language: string) {
    return new Set(['java', 'python']).has(language) ? `ace/mode/${language}` : 'ace/mode/text'
}

export function CodeEditor() {
    const [editor, setEditor] = React.useState<ace.Editor>(undefined)
    const dispatch = useDispatch()
    const { breakpoint, language, marker } = useRedux(state => ({
        breakpoint: state.breakpoint,
        language: state.language,
        marker: state.marker
    }))

    React.useEffect(() => {
        if (!editor) return
        editor.$blockScrolling = Infinity
        editor.setTheme('ace/theme/chrome')
        editor.setFontSize('1rem')
        editor.setOptions({ enableBasicAutocompletion: true, enableLiveAutocompletion: true, enableSnippets: true })

        const onChange = (change: ace.EditorChangeEvent) => dispatch(codeActions.set(editor.session.doc.getAllLines()))

        const onGutterMouseDown = (event: EditorMouseEvent) => {
            const gutterLayer = (editor.renderer as any).$gutterLayer as EditorGutterLayer
            const region = gutterLayer.getRegion(event)
            if (region !== 'markers') return
            const line = (event.getDocumentPosition() as ace.Position).row
            dispatch(breakpointActions.toggle(line))
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
        decorations.forEach((decoration, i) => editor.session.removeGutterDecoration(i, classes.breakpoint))
        breakpoint.forEach(line => editor.session.addGutterDecoration(line, classes.breakpoint))
    }, [breakpoint])

    React.useEffect(() => {
        if (!editor) return
        const aceMarkers = editor.session.getMarkers(false) as EditorMarker[]
        Object.values(aceMarkers)
            .filter(marker => marker.id > 2)
            .forEach(marker => editor.session.removeMarker(marker.id))
        marker.forEach(marker =>
            editor.session.addMarker(new Range(marker.line, 0, marker.line, 1), classes[marker.type], 'fullLine', false)
        )
    }, [marker])

    return <MemoTextEditor onEditorUpdate={setEditor} />
}
