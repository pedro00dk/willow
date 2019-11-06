import ace from 'brace'
import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import { colors } from '../../colors'
import { actions as inputActions } from '../../reducers/input'
import { useDispatch, useSelection } from '../../reducers/Store'
import { EditorMarker, range, TextEditor } from './TextEditor'

const classes = {
    marker: cn('position-absolute', css({ backgroundColor: colors.blue.light }))
}

export const InputEditor = () => {
    const [editor, setEditor] = React.useState<ace.Editor>()
    const dispatch = useDispatch()
    const fetching = useSelection(state => state.tracer.fetching)

    React.useEffect(() => {
        if (!editor) return
        editor.renderer.setShowGutter(false)
        editor.on('change', () => dispatch(inputActions.set(editor.session.doc.getAllLines().slice(0, -1))))
    }, [editor])

    React.useEffect(() => {
        if (!editor) return
        editor.setReadOnly(fetching)
        Object.values(editor.session.getMarkers(false) as EditorMarker[])
            .filter(marker => marker.id > 2)
            .forEach(marker => editor.session.removeMarker(marker.id))
        if (!fetching) return
        editor.session.addMarker(range(0, 0, editor.session.getLength() - 1, 1), classes.marker, 'fullLine', false)
    }, [editor, fetching])

    return <TextEditor onEditor={setEditor} />
}
