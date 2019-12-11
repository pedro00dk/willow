import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import { useSelection } from '../../../reducers/Store'
import * as schema from '../../../schema/schema'
import { ScopeTrace } from './ScopeTrace'

export type ScopeSlice = { name: string; range: [number, number]; nodes: schema.Scope[]; children: schema.Scope[][] }

const classes = {
    container: cn('d-flex position-absolute align-items-start flex-nowrap overflow-auto', css({ userSelect: 'none' }))
}

export const StackTrace = React.memo(() => {
    const ref = React.useRef<HTMLDivElement>()
    const [size, setSize] = React.useState({ x: 0, y: 0 })
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
            const parentSize = { x: ref.current.parentElement.clientWidth, y: ref.current.parentElement.clientHeight }
            if (size.x === parentSize.x && size.y === parentSize.y) return
            setSize(parentSize)
        }, 1000)

        return () => clearInterval(interval)
    }, [ref.current, size])

    return (
        <div ref={ref} className={classes.container} style={{ width: size.x - 1, height: size.y - 1 }}>
            {steps && <ScopeTrace scopeSlice={scopeSlice} width={size.x} />}
        </div>
    )
})
