import ace from 'brace'
import { css } from 'emotion'
import React from 'react'
import { colors } from '../../colors'
import { useSelection } from '../../reducers/Store'
import { EditorMarker, Range, TextEditor } from './TextEditor'

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
    ok: `position-absolute ${css({ background: colors.blue.light })}`,
    warn: `position-absolute ${css({ background: colors.yellow.light })}`,
    error: `position-absolute ${css({ background: colors.red.light })}`
}

const supportedLanguages = new Set(['java', 'python'])

export const SourceEditor = () => {
    const editor = React.useRef<ace.Editor>()
    const { source } = useSelection(state => ({ source: state.source }))

    React.useLayoutEffect(() => {
        editor.current.setTheme('ace/theme/chrome')
        const options = { enableBasicAutocompletion: true, enableLiveAutocompletion: true, enableSnippets: true }
        editor.current.setOptions(options)
        editor.current.on('change', () => (source.content = editor.current.session.doc.getAllLines()))
    }, [editor.current])

    useSelection(async (state, previousState) => {
        const language = state.language.languages[state.language.selected]
        const previousLanguage = previousState.language?.languages[previousState.language.selected]
        if (!editor.current || language === previousLanguage) return
        editor.current.session.setMode(`ace/mode/${supportedLanguages.has(language) ? language : 'text'}`)
    })

    useSelection(async (state, previousState) => {
        const step = state.tracer.steps?.[state.tracer.index]
        const previousStep = previousState.tracer?.steps?.[previousState.tracer.index]
        if (!editor.current || !state.tracer.available || step === previousStep) return
        Object.values(editor.current.session.getMarkers(false) as { [id: number]: EditorMarker })
            .filter(marker => marker.id > 2)
            .forEach(marker => editor.current.session.removeMarker(marker.id))
        if (!step.snapshot) return
        const line = step.snapshot.stack[step.snapshot.stack.length - 1].line
        editor.current.session.addMarker(new Range(line, 0, line, 1), classes[step.snapshot.info], 'fullLine', false)
        editor.current.scrollToLine(line, true, true, undefined)
    })

    return <TextEditor onEditor={React.useCallback(e => (editor.current = e), [])} />
}
