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
    const editor = React.useRef<ace.Editor>()
    let currentLanguage = React.useRef<string>()
    let currentInfo = React.useRef<string>()
    let currentLine = React.useRef<number>()
    const dispatch = useDispatch()

    React.useEffect(() => {
        editor.current.setTheme('ace/theme/chrome')
        editor.current.setOptions({
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true
        })
        editor.current.on('change', () => dispatch(sourceActions.set(editor.current.session.doc.getAllLines())))
    }, [editor.current])

    useSelection(async state => {
        const language = state.language.languages[state.language.selected]
        if (!editor || language === currentLanguage.current) return
        editor.current.session.setMode(`ace/mode/${languages.has(language) ? language : 'text'}`)
        currentLanguage.current = language
    })

    useSelection(async state => {
        const snapshot = state.tracer.steps?.[state.tracer.index].snapshot
        const info = snapshot?.info
        const line = snapshot?.stack[snapshot.stack.length - 1].line
        if (!editor || !snapshot || (info === currentInfo.current && line === currentLine.current)) return
        Object.values(editor.current.session.getMarkers(false) as EditorMarker[])
            .filter(marker => marker.id > 2)
            .forEach(marker => editor.current.session.removeMarker(marker.id))
        editor.current.session.addMarker(range(line, 0, line, 1), classes[snapshot.info], 'fullLine', false)
        editor.current.scrollToLine(line, true, true, undefined)
        currentInfo.current = info
        currentLine.current = line
    })

    return <TextEditor onEditor={React.useCallback(e => (editor.current = e), [])} />
}
