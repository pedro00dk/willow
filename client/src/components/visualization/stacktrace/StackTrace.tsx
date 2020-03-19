import React from 'react'
import { useSelection } from '../../../reducers/Store'
import * as tracer from '../../../types/tracer'
import { ScopeTrace } from './ScopeTrace'

const classes = {
    container: 'd-flex position-absolute overflow-auto'
}

export type ScopeSlice = { name: string; range: [number, number]; scopes: tracer.Scope[]; children: tracer.Scope[][] }

export const StackTrace = () => {
    const container$ = React.useRef<HTMLDivElement>()
    const { available, steps } = useSelection(state => ({
        available: state.tracer.available,
        steps: state.tracer.available && state.tracer.steps
    }))

    const rootScopeSlice = React.useMemo(() => {
        if (!available) return
        const children = steps.map(step => {
            if (step.snapshot) return step.snapshot.stack
            const error = step.error.exception?.type ?? step.error.cause
            return [{ name: error, line: -1, members: [] }]
        })
        return { name: '', range: [0, steps.length - 1], scopes: [], children } as ScopeSlice
    }, [available, steps])

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

    return (
        <div ref={container$} className={classes.container}>
            {available && <ScopeTrace scopeSlice={rootScopeSlice} />}
        </div>
    )
}
