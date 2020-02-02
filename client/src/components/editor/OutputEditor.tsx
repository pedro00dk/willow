import ace from 'brace'
import React from 'react'
import { useSelection } from '../../reducers/Store'
import { TextEditor } from './TextEditor'

export const OutputEditor = () => {
    const editor = React.useRef<ace.Editor>()
    const output = React.useRef<string[]>()

    React.useLayoutEffect(() => void editor.current.renderer.setShowGutter(false), [editor.current])

    useSelection(async (state, previousState) => {
        if (!state.tracer.steps || state.tracer.steps === previousState.tracer?.steps) return
        const steps = state.tracer.steps
        output.current = steps.reduce((acc, { prints, threw }) => {
            acc.push(`${acc[acc.length - 1] ?? ''}${prints ?? ''}${threw?.cause ?? threw?.exception.traceback ?? ''}`)
            return acc
        }, [] as string[])
    })

    useSelection(async (state, previousState) => {
        if (!editor || state.tracer.index == undefined || state.tracer.index === previousState.tracer?.index) return
        editor.current.session.doc.setValue(output.current[state.tracer.index])
        editor.current.scrollToLine(editor.current.session.getLength(), true, true, undefined)
    })

    return <TextEditor onEditor={React.useCallback(e => (editor.current = e), [])} />
}
