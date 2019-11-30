import ace from 'brace'
import React from 'react'
import { useSelection } from '../../reducers/Store'
import { TextEditor } from './TextEditor'

export const OutputEditor = () => {
    const editor = React.useRef<ace.Editor>()
    const currentIndex = React.useRef<number>()

    React.useEffect(() => {
        editor.current.renderer.setShowGutter(false)
        editor.current.setReadOnly(true)
    }, [editor.current])

    useSelection(async state => {
        const index = state.tracer.index
        if (!editor || index == undefined || index === currentIndex.current) return
        editor.current.session.doc.setValue(state.output[index])
        editor.current.scrollToLine(editor.current.session.getLength(), true, true, undefined)
        currentIndex.current = index
    })

    return <TextEditor onEditor={React.useCallback(e => (editor.current = e), [])} />
}
