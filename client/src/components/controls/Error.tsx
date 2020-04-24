import { css } from 'emotion'
import React from 'react'
import { colors } from '../../colors'
import { useSelection } from '../../reducers/Store'

const classes = {
    container: `position-fixed ${css({ left: '50%', top: '2%', zIndex: 20 })}`,
    snackbar: `text-center rounded p-1 ${css({
        marginLeft: '-150px',
        width: '300px',
        background: colors.gray.darker,
        color: 'white',
        transition: 'opacity 0.5s ease'
    })}`
}

export const Error = () => {
    const snackbar$ = React.useRef<HTMLDivElement>()
    const index = React.useRef(0)
    const { error } = useSelection(state => ({ error: state.error }))

    React.useEffect(() => {
        const next = error[index.current]
        if (!next) return
        index.current++
        console.log(next.error)
        snackbar$.current.textContent = next.error
        snackbar$.current.style.visibility = 'visible'
        snackbar$.current.style.opacity = '1'
        const opacityHandler = setTimeout(() => (snackbar$.current.style.opacity = '0'), 2500)
        const visibilityHandler = setTimeout(() => (snackbar$.current.style.visibility = 'hidden'), 3000)
        return () => {
            clearTimeout(opacityHandler)
            clearTimeout(visibilityHandler)
        }
    })

    return (
        <div className={classes.container}>
            <div ref={snackbar$} className={classes.snackbar} style={{ opacity: 0, visibility: 'hidden' }} />
        </div>
    )
}
