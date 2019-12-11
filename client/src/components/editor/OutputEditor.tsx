import ace from 'brace'
import React from 'react'
import { useSelection } from '../../reducers/Store'
import * as schema from '../../schema/schema'
import { TextEditor } from './TextEditor'

export const OutputEditor = () => {
    const editor = React.useRef<ace.Editor>()
    const setEditor = React.useCallback(e => (editor.current = e), [])
    const currentSteps = React.useRef<schema.Step[]>()
    const currentOutput = React.useRef<string[]>()
    const currentIndex = React.useRef<number>()

    React.useEffect(() => void editor.current.renderer.setShowGutter(false), [editor.current])

    useSelection(async state => {
        const steps = state.tracer.steps
        if (!editor.current || !steps || steps === currentSteps.current) return
        currentOutput.current = steps.reduce((acc, { prints, threw }) => {
            acc.push(`${acc[acc.length - 1] ?? ''}${threw?.cause ?? threw?.exception.traceback ?? ''}${prints ?? ''}`)
            return acc
        }, [] as string[])
        currentSteps.current = steps
    })

    useSelection(async state => {
        const index = state.tracer.index
        if (!editor || index == undefined || index === currentIndex.current) return
        editor.current.session.doc.setValue(currentOutput.current[index])
        editor.current.scrollToLine(editor.current.session.getLength(), true, true, undefined)
        currentIndex.current = index
    })

    return <TextEditor onEditor={setEditor} />
}
