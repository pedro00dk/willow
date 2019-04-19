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

import callImg from '../../../public/editor/call.svg'
import returnImg from '../../../public/editor/return.svg'

import 'brace/ext/language_tools'
import 'brace/ext/searchbox'
import 'brace/mode/java'
import 'brace/mode/python'
import 'brace/mode/text'
import 'brace/theme/chrome'

const classes = {
    [protocol.Snapshot.Type.LINE]: cn('position-absolute', css({ backgroundColor: colors.primaryBlue.light })),
    [protocol.Snapshot.Type.CALL]: cn(
        'position-absolute',
        css({ background: `${colors.primaryBlue.light} url(${callImg}) no-repeat right` })
    ),
    [protocol.Snapshot.Type.RETURN]: cn(
        'position-absolute',
        css({ background: `${colors.primaryBlue.light} url(${returnImg}) no-repeat right` })
    ),
    [protocol.Snapshot.Type.EXCEPTION]: cn('position-absolute', css({ backgroundColor: colors.secondaryRed.light }))
}

const { Range } = ace.acequire('ace/range') as {
    Range: new (startRow: number, startColumn: number, endRow: number, endColumn: number) => ace.Range
}

const getSyntaxSupport = (language: string) =>
    new Set(['java', 'python']).has(language) ? `ace/mode/${language}` : 'ace/mode/text'

export function CodeEditor() {
    const [editor, setEditor] = React.useState<ace.Editor>(undefined)
    const dispatch = useDispatch()
    const { language, tracer } = useRedux(state => ({
        language: state.language,
        tracer: state.tracer
    }))

    React.useEffect(() => {
        if (!editor) return
        editor.setTheme('ace/theme/chrome')
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
        editor.session.setMode(getSyntaxSupport(language.languages[language.selected]))
    }, [language.selected])

    React.useEffect(() => {
        if (!editor) return
        const aceMarkers = editor.session.getMarkers(false) as EditorMarker[]
        Object.values(aceMarkers)
            .filter(marker => marker.id > 2)
            .forEach(marker => editor.session.removeMarker(marker.id))

        if (!tracer.available) return
        const snapshot = tracer.steps[tracer.index].snapshot
        if (!snapshot) return
        const line = snapshot.stack[snapshot.stack.length - 1].line
        editor.session.addMarker(new Range(line, 0, line, 1), classes[snapshot.type], 'fullLine', false)
    }, [tracer])

    return <MemoTextEditor onEditorUpdate={setEditor} />
}
