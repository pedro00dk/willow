import ace from 'brace'
import React from 'react'
import { useSelection } from '../../reducers/Store'
import * as schema from '../../schema/schema'
import { TextEditor } from './TextEditor'

export const OutputEditor = () => {
    const editor = React.useRef<ace.Editor>()
    const currentSteps = React.useRef<schema.Step[]>()
    const currentOutput = React.useRef<string[]>()
    const currentIndex = React.useRef<number>()

    useSelection(async state => {
        const steps = state.tracer.steps
        if (!editor || steps == undefined || steps === currentSteps.current) return
        let previous = ''
        currentOutput.current = steps.map(
            ({ prints, threw }) =>
                (previous = `${previous}${threw?.cause ?? threw?.exception.traceback ?? ''}${prints ?? ''}`)
        )
        currentSteps.current = steps
    })

    useSelection(async state => {
        const index = state.tracer.index
        if (!editor || index == undefined || index === currentIndex.current) return
        editor.current.session.doc.setValue(currentOutput.current[index])
        editor.current.scrollToLine(editor.current.session.getLength(), true, true, undefined)
        currentIndex.current = index
    })

    return <TextEditor onEditor={React.useCallback(e => (editor.current = e), [])} />
}
