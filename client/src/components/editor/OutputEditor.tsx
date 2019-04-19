import * as ace from 'brace'
import * as React from 'react'
import * as protocol from '../../protobuf/protocol'
import { useRedux } from '../../reducers/Store'
import { MemoTextEditor } from './TextEditor'

export function OutputEditor() {
    const [editor, setEditor] = React.useState<ace.Editor>(undefined)
    const { tracer } = useRedux(state => ({ tracer: state.tracer }))

    React.useEffect(() => {
        if (!editor) return
        editor.renderer.setShowGutter(false)
        editor.setReadOnly(true)
    }, [editor])

    React.useEffect(() => {
        if (!editor) return
        editor.session.doc.setValue(
            tracer.steps
                .filter((step, i) => i <= tracer.index)
                .map((step, i) => {
                    const snapshot = step.snapshot
                    const previousSnapshot = !!tracer.steps[i - 1] ? tracer.steps[i - 1].snapshot : undefined
                    const tracedThrew =
                        !!snapshot &&
                        snapshot.finish &&
                        !!previousSnapshot &&
                        previousSnapshot.type === protocol.Snapshot.Type.EXCEPTION
                            ? previousSnapshot.exception.traceback.join('')
                            : ''
                    const tracerThrew = !!step.threw
                        ? !!step.threw.exception
                            ? step.threw.exception.traceback.join('')
                            : step.threw.cause
                        : ''
                    return `${step.prints}${tracedThrew}${tracerThrew}`
                })
                .join('')
        )
    }, [tracer])

    return <MemoTextEditor onEditorUpdate={setEditor} />
}
