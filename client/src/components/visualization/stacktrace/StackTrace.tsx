import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import { useSelection } from '../../../reducers/Store'
import * as schema from '../../../schema/schema'
import { ScopeTrace } from './ScopeTrace'

export type ScopeSlice = { name: string; range: [number, number]; nodes: schema.Scope[]; children: schema.Scope[][] }

const classes = {
    container: cn('d-flex align-items-start flex-nowrap overflow-auto w-100 h-100', css({ userSelect: 'none' }))
}

export const StackTrace = React.memo(() => {
    const ref = React.useRef<HTMLDivElement>()
    const [width, setWidth] = React.useState(0)
    const { steps } = useSelection(state => ({ steps: state.tracer.steps }))

    const scopeSlice = React.useMemo(() => {
        if (!steps) return
        return {
            name: undefined,
            range: [0, steps.length - 1],
            nodes: [],
            children: steps.map(
                ({ snapshot, threw }) =>
                    snapshot?.stack ?? [{ name: threw.cause ?? threw.exception.type } as schema.Scope]
            )
        } as ScopeSlice
    }, [steps])

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (ref.current.clientWidth === width) return
            setWidth(ref.current.clientWidth)
        }, 1000)

        return () => clearInterval(interval)
    }, [ref, width])

    return (
        <div ref={ref} className={classes.container}>
            {steps && <ScopeTrace scopeSlice={scopeSlice} width={width} />}
        </div>
    )
})
