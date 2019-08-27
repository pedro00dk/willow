import * as ace from 'brace'
import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../colors'
import { actions as programActions } from '../../reducers/program'
import { useDispatch, useRedux } from '../../reducers/Store'
import { EditorMarker, range, TextEditor } from './TextEditor'

import callImg from '../../../public/editor/call.svg'
import returnImg from '../../../public/editor/return.svg'

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
    line: cn('position-absolute', css({ background: colors.blue.light })),
    call: cn('position-absolute', css({ background: `${colors.blue.light} url(${callImg}) no-repeat right` })),
    return: cn('position-absolute', css({ background: `${colors.blue.light} url(${returnImg}) no-repeat right` })),
    exception: cn('position-absolute', css({ background: colors.red.light }))
}

const supportedLanguages = new Set(['java', 'python'])

export const CodeEditor = () => {
    const [editor, setEditor] = React.useState<ace.Editor>()
    const dispatch = useDispatch()
    const { language, tracer } = useRedux(state => ({ language: state.program.language, tracer: state.tracer }))

    const getSyntaxSupport = (language: string) =>
        supportedLanguages.has(language) ? `ace/mode/${language}` : 'ace/mode/text'

    React.useEffect(() => {
        if (!editor) return
        editor.setTheme('ace/theme/chrome')
        editor.setOptions({ enableBasicAutocompletion: true, enableLiveAutocompletion: true, enableSnippets: true })

        const onChange = (change: ace.EditorChangeEvent) =>
            dispatch(programActions.setSource(editor.session.doc.getAllLines()))

        editor.on('change', onChange)
        return () => editor.off('change', onChange)
    }, [editor])

    React.useEffect(() => {
        if (!editor) return
        editor.session.setMode(getSyntaxSupport(language))
    }, [editor, language])

    React.useEffect(() => {
        if (!editor) return
        const markers = editor.session.getMarkers(false) as EditorMarker[]
        Object.values(markers)
            .filter(marker => marker.id > 2)
            .forEach(marker => editor.session.removeMarker(marker.id))
        if (!tracer.available) return
        const snapshot = tracer.steps[tracer.index].snapshot
        if (!snapshot) return
        const line = snapshot.stack[snapshot.stack.length - 1].line
        editor.session.addMarker(range(line, 0, line, 1), classes[snapshot.type], 'fullLine', false)
        editor.scrollToLine(line, true, true, undefined)
    }, [editor, tracer])

    return <TextEditor onEditor={setEditor} />
}
