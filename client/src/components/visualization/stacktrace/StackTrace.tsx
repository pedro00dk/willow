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
        const onResize = (event?: UIEvent) => {
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

        onResize()
        globalThis.addEventListener('resize', onResize)
        return () => globalThis.removeEventListener('resize', onResize)
    }, [container$])

    return (
        <div ref={container$} className={classes.container}>
            {steps && <ScopeTrace scopeSlice={scopeSlice} />}
        </div>
    )
}
