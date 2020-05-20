import ace from 'brace'
import 'brace/ext/language_tools'
import 'brace/ext/searchbox'
import 'brace/mode/java'
import 'brace/mode/python'
import 'brace/mode/text'
import 'brace/snippets/java'
import 'brace/snippets/python'
import 'brace/snippets/text'
import 'brace/theme/chrome'
import { css } from 'emotion'
import React from 'react'
import { colors } from '../../colors'
import { actions, useDispatch, useSelection } from '../../reducers/Store'
import { EditorMarker, Range, TextEditor } from './TextEditor'

const classes = {
    call: `position-absolute ${css({ background: colors.green.lighter })}`,
    line: `position-absolute ${css({ background: colors.blue.lighter })}`,
    return: `position-absolute ${css({ background: colors.yellow.lighter })}`,
    exception: `position-absolute ${css({ background: colors.red.lighter })}`
}

const supportedLanguages = ['java', 'python']

export const SourceEditor = () => {
    const editor = React.useRef<ace.Editor>()
    const language = React.useRef('')
    const highlight = React.useRef({ line: -1, event: '' })
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
        await undefined
        const selected = state.language.selected
        if (!editor.current || selected == undefined || language.current === selected) return
        language.current = supportedLanguages.reduce((acc, next) => (selected.includes(next) ? next : acc), 'text')
        editor.current.session.setMode(`ace/mode/${language.current}`)
    })

    useSelection(async state => {
        await undefined
        if (!editor.current || !state.tracer.available) return
        const snapshot = state.tracer.steps[state.index].snapshot
        const line = snapshot?.stack[snapshot.stack.length - 1].line
        const event = snapshot?.event
        Object.values(editor.current.session.getMarkers(false) as { [id: number]: EditorMarker })
            .filter(marker => marker.id > 2)
            .forEach(marker => editor.current.session.removeMarker(marker.id))
        if (!snapshot) return
        highlight.current.line = line
        highlight.current.event = event
        editor.current.session.addMarker(new Range(line, 0, line, 1), classes[event], 'fullLine', false)
        editor.current.scrollToLine(line, true, true, undefined)
    })

    return <TextEditor onEditor={React.useCallback(e => (editor.current = e), [])} />
}
