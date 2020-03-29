import ace from 'brace'
import React from 'react'
import { actions, useDispatch, useSelection } from '../../reducers/Store'
import { TextEditor } from './TextEditor'

export const InputEditor = () => {
    const editor = React.useRef<ace.Editor>()
    const dispatch = useDispatch()
    const { input } = useSelection(state => ({ input: state.input }))

    React.useLayoutEffect(() => {
        editor.current.renderer.setShowGutter(false)
        const onChange = () => dispatch(actions.input.set(editor.current.session.doc.getAllLines()), false)
        editor.current.addEventListener('change', onChange)
        return () => editor.current.removeEventListener('change', onchange)
    }, [editor.current])

    React.useLayoutEffect(() => {
        editor.current.session.doc.setValue(input.content.join('\n'))
    }, [input])

    useSelection(async state => {
        state.tracer.fetching !== editor.current?.getReadOnly() && editor.current?.setReadOnly(state.tracer.fetching)
    })

    return <TextEditor onEditor={React.useCallback(e => (editor.current = e), [])} />
}
