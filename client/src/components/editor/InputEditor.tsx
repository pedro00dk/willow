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

export function InputEditor() {
    const [editor, setEditor] = React.useState<ace.Editor>(undefined)
    const dispatch = useDispatch()
    const { fetching } = useRedux(state => ({ fetching: state.tracer.fetching }))

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
        editor.setReadOnly(fetching)
        if (fetching)
            [...Array(editor.session.doc.getLength() - 1).keys()] //
                .forEach(line =>
                    editor.session.addMarker(new range(line, 0, line, 1), classes.marker, 'fullLine', false)
                )
        else
            Object.values(editor.session.getMarkers(false) as EditorMarker[]) //
                .forEach(marker => (marker.id > 2 ? editor.session.removeMarker(marker.id) : undefined))
    }, [editor, fetching])

    return <MemoTextEditor onEditor={setEditor} />
}
