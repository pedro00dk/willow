import React from 'react'
import { useSelection } from '../../../reducers/Store'
import { Scope } from './Scope'

const classes = {
    container: 'd-flex flex-column position-absolute overflow-auto'
}

export const Stack = () => {
    const container$ = React.useRef<HTMLDivElement>()
    const { stack } = useSelection(state => ({ stack: state.tracer.steps?.[state.tracer.index].snapshot?.stack }))
    React.useLayoutEffect(() => {
        const onResize = (event: Event) => {
            const element$ = container$.current
            const parent$ = element$.parentElement
            if (element$.clientWidth === parent$.clientWidth && element$.clientHeight === parent$.clientHeight) return
            element$.style.width = `${parent$.clientWidth}px`
            element$.style.height = `${parent$.clientHeight}px`
        }

        onResize(undefined)
        addEventListener('paneResize', onResize)
        return () => removeEventListener('paneResize', onResize)
    }, [container$.current])

    React.useEffect(() => container$.current.scrollBy({ top: Number.MAX_SAFE_INTEGER, behavior: 'smooth' }))

    return (
        <div ref={container$} className={classes.container}>
            {!stack && <Scope scope={{ line: 0, name: 'Stack', variables: [] }} />}
            {stack && stack.map((scope, i) => <Scope key={i} scope={scope} />)}
        </div>
    )
}
