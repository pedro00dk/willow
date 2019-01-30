import * as ace from 'brace'
import * as React from 'react'

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
}

export function Editor(props: EditorProps) {
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
        }
    )


    return <div ref={divRef} className='w-100 h-100' />
}
