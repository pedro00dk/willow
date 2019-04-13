import * as ace from 'brace'
import * as React from 'react'
import * as protocol from '../../protobuf/protocol'
import { useRedux } from '../../reducers/Store'
import { MemoTextEditor } from './TextEditor'

export function OutputEditor() {
    const [editor, setEditor] = React.useState<ace.Editor>(undefined)
    const { debugIndexer, debugResult } = useRedux(state => ({
        debugIndexer: state.debugIndexer,
        debugResult: state.debugResult
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
        editor.session.doc.setValue(
            debugResult.steps
                .filter((step, i) => i <= debugIndexer)
                .map((step, i) => {
                    const snapshot = step.snapshot
                    const previousSnapshot = !!debugResult.steps[i - 1] ? debugResult.steps[i - 1].snapshot : undefined
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
    }, [debugIndexer, debugResult])

    return <MemoTextEditor onEditorUpdate={setEditor} />
}
