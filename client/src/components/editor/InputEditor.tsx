import ace from 'brace'
import React from 'react'
import { useSelection } from '../../reducers/Store'
import { TextEditor } from './TextEditor'

export const InputEditor = () => {
    const editor = React.useRef<ace.Editor>()
    const { input } = useSelection(state => ({ input: state.input }))

    React.useLayoutEffect(() => {
        editor.current.renderer.setShowGutter(false)
        editor.current.session.doc.setValue(input.content.join('\n'))
        editor.current.on('change', () => (input.content = editor.current.session.doc.getAllLines()))
    }, [editor.current])

    useSelection(async state => {
        state.tracer.fetching !== editor.current?.getReadOnly() && editor.current?.setReadOnly(state.tracer.fetching)
    })

    return <TextEditor onEditor={React.useCallback(e => (editor.current = e), [])} />
}
