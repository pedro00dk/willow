import * as ace from 'brace'
import * as React from 'react'
import * as protocol from '../../protobuf/protocol'
import { useRedux } from '../../reducers/Store'
import { MemoTextEditor } from './TextEditor'

export function OutputEditor() {
    const [editor, setEditor] = React.useState<ace.Editor>(undefined)
    const { debugReference, debugResponse } = useRedux(state => ({
        debugReference: state.debugReference,
        debugResponse: state.debugResponse
    }))

    React.useEffect(() => {
        if (!editor) return
        editor.$blockScrolling = Infinity
        editor.setReadOnly(true)
        editor.setFontSize('1rem')
        editor.renderer.setShowGutter(false)
    }, [editor])

    React.useEffect(() => {
        if (!editor) return
        const currentStep = debugResponse.steps[debugReference]
        const previousStep = debugResponse.steps[debugReference - 1]
        const exceptionTraceback =
            !!currentStep &&
            currentStep.frame.finish &&
            !!previousStep &&
            previousStep.frame.type === protocol.Frame.Type.EXCEPTION
                ? previousStep.frame.exception.traceback.join('')
                : ''
        const lockedMessage = !!debugResponse.locked ? `Program locked, cause: ${debugResponse.locked.cause}` : ''
        const threwTraceback = !!debugResponse.threw ? debugResponse.threw.exception.traceback.join('') : ''
        editor.session.doc.setValue(
            `${debugResponse.steps
                .filter((step, i) => i <= debugReference)
                .flatMap(step => step.prints)
                .join('')}${exceptionTraceback}${lockedMessage}${threwTraceback}
            `
        )
    }, [debugReference, debugResponse])

    return <MemoTextEditor onEditorUpdate={setEditor} />
}
