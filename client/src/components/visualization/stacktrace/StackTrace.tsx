import React from 'react'
import { useSelection } from '../../../reducers/Store'
import * as schema from '../../../schema/schema'
import { ScopeTrace } from './ScopeTrace'

export type ScopeSlice = { name: string; range: [number, number]; nodes: schema.Scope[]; children: schema.Scope[][] }

const classes = {
    container: 'd-flex  overflow-auto w-100'
}

export const StackTrace = () => {
    const { steps } = useSelection(state => ({ steps: state.tracer.steps }))

    const scopeSlice = React.useMemo(() => {
        if (!steps) return
        const children = steps.map(({ snapshot, threw }) => {
            return snapshot?.stack ?? [{ name: threw.cause ?? threw.exception.type } as schema.Scope]
        })
        return { name: undefined, range: [0, steps.length - 1], nodes: [], children } as ScopeSlice
    }, [steps])

    return <div className={classes.container}>{steps && <ScopeTrace scopeSlice={scopeSlice} />}</div>
}
