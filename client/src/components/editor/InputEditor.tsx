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
    const editor = React.useRef<ace.Editor>()
    const dispatch = useDispatch()
    const currentFetching = React.useRef<boolean>()

    React.useEffect(() => {
        editor.current.renderer.setShowGutter(false)
        editor.current.on('change', () => dispatch(inputActions.set(editor.current.session.doc.getAllLines())))
    }, [editor.current])

    useSelection(async state => {
        const fetching = state.tracer.fetching
        if (!editor.current || fetching === currentFetching.current) return
        editor.current.setReadOnly(fetching)
        currentFetching.current = fetching
    })

    return <TextEditor onEditor={React.useCallback(e => (editor.current = e), [])} />
}
