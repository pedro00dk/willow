import ace from 'brace'
import React from 'react'
import { useSelection } from '../../reducers/Store'
import { TextEditor } from './TextEditor'

export const OutputEditor = () => {
    const editor = React.useRef<ace.Editor>()
    const output = React.useRef<string[]>([])

    React.useLayoutEffect(() => {
        editor.current.renderer.setShowGutter(false)
    }, [editor.current])

    useSelection(async (state, previousState) => {
        const tracer = state.tracer
        const previousTracer = previousState.tracer
        if (
            !tracer.available ||
            (tracer.response === previousTracer?.response && output.current.length === tracer.steps.length)
        )
            return
        output.current = tracer.steps.reduce((acc, step) => {
            const previousContent = acc[acc.length - 1] ?? ''
            const prints = step.print ?? ''
            const error = step.error?.exception?.traceback ?? step.error?.cause ?? ''
            acc.push(`${previousContent}${prints}${error}`)
            return acc
        }, [] as string[])
    })

    useSelection(async state => {
        const tracer = state.tracer
        if (!editor.current || !tracer.available) return
        editor.current.session.doc.setValue(output.current[state.tracer.index])
        editor.current.scrollToLine(editor.current.session.getLength(), true, true, undefined)
    })

    return <TextEditor onEditor={React.useCallback(e => (editor.current = e), [])} />
}
