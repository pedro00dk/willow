import ace from 'brace'
import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import { colors } from '../../colors'
import { actions as sourceActions } from '../../reducers/source'
import { useDispatch, useSelection } from '../../reducers/Store'
import { EditorMarker, range, TextEditor } from './TextEditor'

import 'brace/ext/language_tools'
import 'brace/ext/searchbox'
import 'brace/mode/java'
import 'brace/mode/python'
import 'brace/mode/text'
import 'brace/snippets/java'
import 'brace/snippets/python'
import 'brace/snippets/text'
import 'brace/theme/chrome'

const classes = {
    ok: cn('position-absolute', css({ background: colors.blue.light })),
    warn: cn('position-absolute', css({ background: colors.yellow.light })),
    error: cn('position-absolute', css({ background: colors.red.light }))
}

const languages = new Set(['java', 'python'])

export const SourceEditor = () => {
    const [editor, setEditor] = React.useState<ace.Editor>()
    const dispatch = useDispatch()
    const { language, tracer } = useSelection(state => ({
        language: state.language.languages[state.language.selected],
        tracer: state.tracer
    }))

    React.useEffect(() => {
        if (!editor) return
        editor.setTheme('ace/theme/chrome')
        editor.setOptions({ enableBasicAutocompletion: true, enableLiveAutocompletion: true, enableSnippets: true })
        editor.on('change', () => dispatch(sourceActions.set(editor.session.doc.getAllLines())))
    }, [editor])

    React.useEffect(() => {
        if (!editor) return
        editor.session.setMode(`ace/mode/${languages.has(language) ? language : 'text'}`)
    }, [editor, language])

    React.useEffect(() => {
        if (!editor) return
        Object.values(editor.session.getMarkers(false) as EditorMarker[])
            .filter(marker => marker.id > 2)
            .forEach(marker => editor.session.removeMarker(marker.id))
        if (!tracer.available) return
        const snapshot = tracer.steps[tracer.index].snapshot
        if (!snapshot) return
        const line = snapshot.stack[snapshot.stack.length - 1].line
        editor.session.addMarker(range(line, 0, line, 1), classes[snapshot.info], 'fullLine', false)
        editor.scrollToLine(line, true, true, undefined)
    }, [editor, tracer])

    return <TextEditor onEditor={setEditor} />
}
