import React, { Children } from 'react'
import { DefaultState } from '../../../../reducers/Store'
import { GraphData } from '../GraphData'
import { SvgNode } from '../svg/SvgNode'
import { Obj } from './Obj'
import * as schema from '../../../../schema/schema'

export const Heap = (props: {
    graphData: GraphData
    forceUpdate: React.Dispatch<{}>
    tracer: DefaultState['tracer']
}) => {
    const depths = React.useMemo(() => {
        const computeDepths = (
            ids: string[],
            heap: { [id: string]: schema.Obj },
            depths: { [id: string]: number } = {},
            depth = 0
        ) => {
            if (ids.length === 0) return depths
            const childrenIds = ids.reduce((acc, next, i) => {
                if (depths[next] !== undefined) return acc
                depths[next] = depth + i
                acc.push(
                    ...heap[next].members
                        .filter(member => typeof member.value === 'object')
                        .map(member => (member.value as string[])[0])
                )
                return acc
            }, [] as string[])
            computeDepths(childrenIds, heap, depths, depth + 1000)
            return depths
        }

        return (props.tracer.steps ?? []).reduce((acc, step, i) => {
            const { stack = [], heap = {} } = step.snapshot ?? {}
            const stackIds = stack
                .flatMap(scope => scope.variables)
                .filter(variable => typeof variable.value === 'object')
                .map(variable => (variable.value as [string])[0])
            acc.push(computeDepths(stackIds, heap))
            return acc
        }, [] as { [id: string]: number }[])
    }, [props.tracer.steps])

    return (
        <>
            {props.tracer.steps &&
                Object.entries(depths).map(([id, depth]) => (
                    <SvgNode key={id} id={id} graphData={props.graphData}>
                        <Obj id={id} {...props} />
                    </SvgNode>
                ))}
        </>
    )
}
