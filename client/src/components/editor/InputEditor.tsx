import * as ace from 'brace'
import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../colors'
import { actions as inputActions } from '../../reducers/input'
import { useDispatch, useRedux } from '../../reducers/Store'
import { EditorMarker, MemoTextEditor } from './TextEditor'

const classes = {
    marker: cn('position-absolute', css({ backgroundColor: colors.primaryBlue.light }))
}

const { Range } = ace.acequire('ace/range') as {
    Range: new (startRow: number, startColumn: number, endRow: number, endColumn: number) => ace.Range
}

export function InputEditor() {
    const [editor, setEditor] = React.useState<ace.Editor>(undefined)
    const dispatch = useDispatch()
    const { tracer } = useRedux(state => ({ tracer: state.tracer }))

    React.useEffect(() => {
        if (!editor) return
        editor.renderer.setShowGutter(false)

        const onChange = (change: ace.EditorChangeEvent) =>
            dispatch(inputActions.set(editor.session.doc.getAllLines().slice(0, -1)))

        editor.on('change', onChange)
        return () => editor.off('change', onChange)
    }, [editor])

    React.useEffect(() => {
        if (!editor) return
        editor.setReadOnly(tracer.fetching)
        if (!tracer.fetching)
            Object.values(editor.session.getMarkers(false) as EditorMarker[])
                .filter(marker => marker.id > 2)
                .forEach(marker => editor.session.removeMarker(marker.id))
        else
            [...Array(editor.session.getLength() - 1).keys()].forEach(line =>
                editor.session.addMarker(new Range(line, 0, line, 1), classes.marker, 'fullLine', false)
            )
    }, [tracer])

    return <MemoTextEditor onEditorUpdate={setEditor} />
}
