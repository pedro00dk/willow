import * as ace from 'brace'
import equal = require('fast-deep-equal')
import * as React from 'react'
import { connect } from 'react-redux'
import { CodeAction, DispatchProp } from '../reducers/Store'

import 'brace/ext/language_tools'
import 'brace/ext/searchbox'
import 'brace/mode/java'
import 'brace/mode/python'
import 'brace/mode/text'
import 'brace/theme/chrome'


type EditorProps = {
    mode: 'java' | 'python' | 'text'
    font?: number
    gutter?: boolean
    onChange?: (text: string) => void
}
// tslint:disable-next-line:variable-name
export const Editor = React.memo(
    (props: EditorProps) => {
        const divRef = React.useRef(undefined)
        const [editor, setEditor] = React.useState<ace.Editor>(undefined)

        React.useEffect(
            () => {
                if (!divRef.current) return
                const editor = ace.edit(divRef.current)
                editor.setTheme('ace/theme/chrome')
                editor.$blockScrolling = Infinity
                setEditor(editor)
            },
            [divRef]
        )

        React.useEffect(
            () => {
                if (!editor) return
                editor.session.setMode(`ace/mode/${props.mode}`)
                editor.setFontSize(`${props.font ? props.font.toString() : 16}px`)
                editor.renderer.setShowGutter(props.gutter)
                editor.setOptions({
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true
                })
                const onEditorChange = () => props.onChange ? props.onChange(editor.getValue()) : undefined
                editor.on('change', onEditorChange)
                return () => editor.off('change', onEditorChange)
            },
            [editor, props.onChange]
        )

        return <div ref={divRef} className='w-100 h-100' />
    },
    (prevProps, nextProps) => !equal(prevProps, nextProps)
)

type CodeEditorProps =
    DispatchProp &
    {
        mode: 'java' | 'python' | 'text'
        font?: number
    }
// tslint:disable-next-line:variable-name
export const CodeEditor = connect()(
    (props: CodeEditorProps) => <Editor
        mode={props.mode}
        font={props.font}
        gutter
        onChange={text => props.dispatch<CodeAction>({ type: 'code/set', text })}
    />
)
