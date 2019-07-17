import * as ace from 'brace'
import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../colors'
import { actions as inputActions } from '../../reducers/input'
import { useDispatch, useRedux } from '../../reducers/Store'
import { EditorMarker, range, TextEditor } from './TextEditor'

const classes = {
    marker: cn('position-absolute', css({ backgroundColor: colors.blue.light }))
}

export const InputEditor = React.memo(() => {
    const [editor, setEditor] = React.useState<ace.Editor>()
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
            editor.session.addMarker(range(0, 0, editor.session.getLength() - 1, 1), classes.marker, 'fullLine', false)
        else
            Object.values(editor.session.getMarkers(false) as EditorMarker[])
                .filter(marker => marker.id > 2)
                .forEach(marker => editor.session.removeMarker(marker.id))
    }, [editor, fetching])

    return <TextEditor onEditor={setEditor} />
})
