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

const supportedLanguages = new Set(['java', 'python'])

export const SourceEditor = () => {
    const editor = React.useRef<ace.Editor>()
    const dispatch = useDispatch()

    React.useLayoutEffect(() => {
        editor.current.setTheme('ace/theme/chrome')
        editor.current.setOptions({
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true
        })
        editor.current.on('change', () => dispatch(sourceActions.set(editor.current.session.doc.getAllLines()), true))
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
        if (!editor.current || !step || step === previousStep) return
        Object.values(editor.current.session.getMarkers(false) as EditorMarker[])
            .filter(marker => marker.id > 2)
            .forEach(marker => editor.current.session.removeMarker(marker.id))
        if (!step.snapshot) return
        const line = step.snapshot.stack[step.snapshot.stack.length - 1].line
        editor.current.session.addMarker(range(line, 0, line, 1), classes[step.snapshot.info], 'fullLine', false)
        editor.current.scrollToLine(line, true, true, undefined)
    })

    return <TextEditor onEditor={React.useCallback(e => (editor.current = e), [])} />
}
