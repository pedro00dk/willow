import React from 'react'
import { useSelection } from '../../../reducers/Store'
import { Scope } from './Scope'

const classes = {
    container: 'd-flex flex-column position-absolute overflow-auto',
    label: 'text-center text-secondary h4 m-auto'
}

export const Stack = () => {
    const container$ = React.useRef<HTMLDivElement>()
    const { available, event = 'line', stack = [] } = useSelection(state => {
        const snapshot = state.tracer.steps?.[state.index].snapshot
        return { available: state.tracer.available, event: snapshot?.event, stack: snapshot?.stack }
    })

    React.useLayoutEffect(() => {
        const onResize = () => {
            const element$ = container$.current
            const parent$ = element$.parentElement
            if (element$.clientWidth === parent$.clientWidth && element$.clientHeight === parent$.clientHeight) return
            element$.style.width = `${parent$.clientWidth}px`
            element$.style.height = `${parent$.clientHeight}px`
        }
        onResize()
        addEventListener('paneResize', onResize)
        return () => removeEventListener('paneResize', onResize)
    }, [container$.current])

    React.useEffect(() => {
        container$.current.scrollBy({ top: Number.MAX_SAFE_INTEGER, behavior: 'smooth' })
    })

    return (
        <div ref={container$} className={classes.container}>
            {available &&
                (stack.length > 0 ? (
                    stack.map((scope, i) => <Scope key={i} scope={scope} event={event} last={i === stack.length - 1} />)
                ) : (
                    <span className={classes.label}>{'Stack unavailable'}</span>
                ))}
        </div>
    )
}
