import React from 'react'
import { useSelection } from '../../../reducers/Store'
import * as schema from '../../../schema/schema'
import { ScopeTrace } from './ScopeTrace'

const classes = {
    container: 'd-flex position-absolute overflow-auto'
}

export type ScopeSlice = { name: string; range: [number, number]; nodes: schema.Scope[]; children: schema.Scope[][] }

export const StackTrace = () => {
    const container$ = React.useRef<HTMLDivElement>()
    const { available, steps } = useSelection(state => ({
        available: state.tracer.available,
        steps: state.tracer.available && state.tracer.steps
    }))

    const baseScopeSlice = React.useMemo(() => {
        if (!available) return
        const children = steps.map(
            step => step.snapshot?.stack ?? [{ name: step.threw.cause ?? step.threw.exception.type } as schema.Scope]
        )
        return { name: undefined, range: [0, steps.length - 1], nodes: [], children } as ScopeSlice
    }, [available, steps])

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

    return (
        <div ref={container$} className={classes.container}>
            {available && <ScopeTrace scopeSlice={baseScopeSlice} />}
        </div>
    )
}
