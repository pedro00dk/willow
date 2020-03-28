import ace from 'brace'
import { css } from 'emotion'
import React from 'react'
import { colors } from '../../colors'
import { actions, useDispatch, useSelection } from '../../reducers/Store'
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
    const language = React.useRef('')
    const highlight = React.useRef({ line: -1, info: '' })
    const dispatch = useDispatch()
    const { source } = useSelection(state => ({ source: state.source }))

    React.useLayoutEffect(() => {
        editor.current.setTheme('ace/theme/chrome')
        const options = { enableBasicAutocompletion: true, enableLiveAutocompletion: true, enableSnippets: true }
        editor.current.setOptions(options)
        const onChange = () => dispatch(actions.source.set(editor.current.session.doc.getAllLines()), false)
        editor.current.addEventListener('change', onChange)
        return () => editor.current.removeEventListener('change', onchange)
    }, [editor.current])

    React.useLayoutEffect(() => {
        editor.current.session.doc.setValue(source.content.join('\n'))
    }, [source])

    useSelection(async state => {
        const selectedLanguage = state.language.languages[state.language.selected]
        if (!editor.current || language.current === selectedLanguage) return
        language.current = supportedLanguages.has(selectedLanguage) ? selectedLanguage : 'text'
        editor.current.session.setMode(`ace/mode/${language.current}`)
    })

    useSelection(async state => {
        if (!editor.current || !state.tracer.available) return
        const snapshot = state.tracer.steps[state.index].snapshot
        const line = snapshot?.stack[snapshot.stack.length - 1].line
        const info = snapshot?.info
        if (!snapshot || (highlight.current.line === line && highlight.current.info === info)) return
        Object.values(editor.current.session.getMarkers(false) as { [id: number]: EditorMarker })
            .filter(marker => marker.id > 2)
            .forEach(marker => editor.current.session.removeMarker(marker.id))
        highlight.current.line = line
        highlight.current.info = info
        editor.current.session.addMarker(new Range(line, 0, line, 1), classes[info], 'fullLine', false)
        editor.current.scrollToLine(line, true, true, undefined)
    })

    return <TextEditor onEditor={React.useCallback(e => (editor.current = e), [])} />
}
