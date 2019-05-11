import * as ace from 'brace'
import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../colors'
import { actions as inputActions } from '../../reducers/input'
import { useDispatch, useRedux } from '../../reducers/Store'
import { EditorMarker, MemoTextEditor, range } from './TextEditor'

const classes = {
    marker: cn('position-absolute', css({ backgroundColor: colors.primaryBlue.light }))
}

// tslint:disable-next-line:variable-name
export const MemoInputEditor = React.memo(InputEditor)
function InputEditor() {
    const [editor, setEditor] = React.useState<ace.Editor>(undefined)
    const dispatch = useDispatch()
    const { tracerFetching } = useRedux(state => ({ tracerFetching: state.tracer.fetching }))

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
        editor.setReadOnly(tracerFetching)
        if (!tracerFetching)
            Object.values(editor.session.getMarkers(false) as EditorMarker[])
                .filter(marker => marker.id > 2)
                .forEach(marker => editor.session.removeMarker(marker.id))
        else
            [...Array(editor.session.getLength() - 1).keys()].forEach(line =>
                editor.session.addMarker(new range(line, 0, line, 1), classes.marker, 'fullLine', false)
            )
    }, [tracerFetching])

    return <MemoTextEditor onEditorUpdate={setEditor} />
}
