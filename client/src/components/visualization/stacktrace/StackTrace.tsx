import React from 'react'
import { useSelection } from '../../../reducers/Store'
import * as schema from '../../../schema/schema'
import { ScopeTrace } from './ScopeTrace'

export type ScopeSlice = { name: string; range: [number, number]; nodes: schema.Scope[]; children: schema.Scope[][] }

const classes = {
    container: 'd-flex position-absolute overflow-auto'
}

export const StackTrace = () => {
    const container$ = React.useRef<HTMLDivElement>()
    const { steps } = useSelection(state => ({ steps: state.tracer.steps }))

    const scopeSlice = React.useMemo(() => {
        if (!steps) return
        const children = steps.map(({ snapshot, threw }) => {
            return snapshot?.stack ?? [{ name: threw.cause ?? threw.exception.type } as schema.Scope]
        })
        return { name: undefined, range: [0, steps.length - 1], nodes: [], children } as ScopeSlice
    }, [steps])

    React.useLayoutEffect(() => {
        const onResize = (event: Event) => {
            const element$ = container$.current
            const parent$ = element$.parentElement
            if (element$.clientWidth === parent$.clientWidth && element$.clientHeight === parent$.clientHeight) return
            element$.style.width = `${parent$.clientWidth}px`
            element$.style.height = `${parent$.clientHeight}px`
        }

        onResize(undefined)
        globalThis.addEventListener('paneResize', onResize)
        return () => globalThis.removeEventListener('paneResize', onResize)
    }, [container$.current])

    return (
        <div ref={container$} className={classes.container}>
            {steps && <ScopeTrace scopeSlice={scopeSlice} />}
        </div>
    )
}
