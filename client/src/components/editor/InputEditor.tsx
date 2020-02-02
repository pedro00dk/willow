import ace from 'brace'
import React from 'react'
import { actions as inputActions } from '../../reducers/input'
import { useDispatch, useSelection } from '../../reducers/Store'
import { TextEditor } from './TextEditor'

export const InputEditor = () => {
    const editor = React.useRef<ace.Editor>()
    const dispatch = useDispatch()

    React.useLayoutEffect(() => {
        editor.current.renderer.setShowGutter(false)
        editor.current.on('change', () => dispatch(inputActions.set(editor.current.session.doc.getAllLines()), true))
    }, [editor])

    useSelection(async state => {
        await undefined
        state.tracer.fetching !== editor.current?.getReadOnly() && editor.current?.setReadOnly(state.tracer.fetching)
    })

    return <TextEditor onEditor={React.useCallback(e => (editor.current = e), [])} />
}
