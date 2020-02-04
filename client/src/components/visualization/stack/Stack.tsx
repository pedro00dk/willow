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
            const parentSize = {
                width: container$.current.parentElement.clientWidth,
                height: container$.current.parentElement.clientHeight
            }
            const size = {
                width: container$.current.clientWidth,
                height: container$.current.clientHeight
            }
            if (size.width === parentSize.width && size.height === parentSize.height) return
            container$.current.style.width = `${parentSize.width - 1}px`
            container$.current.style.height = `${parentSize.height - 1}px`
        }

        onResize(undefined)
        globalThis.addEventListener('paneResize', onResize)
        return () => globalThis.removeEventListener('paneResize', onResize)
    }, [container$.current])

    React.useEffect(() => container$.current.scrollBy({ top: Number.MAX_SAFE_INTEGER, behavior: 'smooth' }))

    return (
        <div ref={container$} className={classes.container}>
            {!stack && <Scope scope={{ line: 0, name: 'Stack', variables: [] }} />}
            {(stack ?? []).map((scope, i) => (
                <Scope key={i} scope={scope} />
            ))}
        </div>
    )
}
