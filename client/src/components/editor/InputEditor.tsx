import ace from 'brace'
import React from 'react'
import { useDispatch, useSelection } from '../../reducers/Store'
import { TextEditor } from './TextEditor'

export const InputEditor = () => {
    const editor = React.useRef<ace.Editor>()
    const dispatch = useDispatch()
    const { input } = useSelection(state => ({ input: state.input }))

    React.useLayoutEffect(() => {
        editor.current.renderer.setShowGutter(false)
        editor.current.session.doc.setValue(input.join('\n'))
        editor.current.on('change', () => dispatch(editor.current.session.doc.getAllLines(), false))
    }, [editor.current])

    useSelection(async state => {
        state.tracer.fetching !== editor.current?.getReadOnly() && editor.current?.setReadOnly(state.tracer.fetching)
    })

    return <TextEditor onEditor={React.useCallback(e => (editor.current = e), [])} />
}
