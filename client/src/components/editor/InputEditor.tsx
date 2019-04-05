import * as ace from 'brace'
import { css } from 'emotion'
import * as React from 'react'
import { actions as inputActions } from '../../reducers/input'
import { useDispatch, useRedux } from '../../reducers/Store'
import { EditorMarker, MemoTextEditor } from './TextEditor'

const styles = {
    readonly: css({ position: 'absolute', backgroundColor: 'ghostwhite' })
}

const { Range } = ace.acequire('ace/range') as {
    Range: new (startRow: number, startColumn: number, endRow: number, endColumn: number) => ace.Range
}

export function InputEditor() {
    const [editor, setEditor] = React.useState<ace.Editor>(undefined)
    const dispatch = useDispatch()
    const { debug } = useRedux(state => ({ debug: state.debug }))

    React.useEffect(() => {
        if (!editor) return
        editor.$blockScrolling = Infinity
        editor.setFontSize('1rem')
        editor.renderer.setShowGutter(false)

        const onChange = (change: ace.EditorChangeEvent) =>
            dispatch(inputActions.set(editor.session.doc.getAllLines().slice(0, -1)))

        editor.on('change', onChange)
        return () => editor.off('change', onChange)
    }, [editor])

    React.useEffect(() => {
        if (!editor) return
        editor.setReadOnly(debug.debugging)
        if (!debug.debugging)
            Object.values(editor.session.getMarkers(false) as EditorMarker[])
                .filter(marker => marker.id > 2)
                .forEach(marker => editor.session.removeMarker(marker.id))
        else
            [...Array(editor.session.getLength() - 1).keys()].forEach(line =>
                editor.session.addMarker(new Range(line, 0, line, 1), styles.readonly, 'fullLine', false)
            )
    }, [debug])

    return <MemoTextEditor onEditorUpdate={setEditor} />
}
