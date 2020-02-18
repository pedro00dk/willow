import React from 'react'
import { DefaultState } from '../../../../reducers/Store'
import { GraphData } from '../GraphData'
import { SvgNode } from '../svg/SvgNode'
import { Obj } from './Obj'

export const Heap = (props: { graphData: GraphData; update: React.Dispatch<{}>; tracer: DefaultState['tracer'] }) => {
    const depths = React.useRef<{ [id: string]: number }[]>([])
    const index = props.graphData.getIndex()
    const { stack = [], heap = {} } = props.tracer.steps?.[index].snapshot ?? {}

    React.useMemo(() => (depths.current = []), [props.tracer.steps])

    const computeDepths = (ids: string[], depths: { [id: string]: number } = {}, depth = 0) => {
        if (ids.length === 0) return depths
        const childrenIds = ids.reduce((acc, next, i) => {
            if (depths[next] != undefined) return acc
            depths[next] = depth + i
            acc.push(
                ...heap[next].members
                    .filter(member => typeof member.value === 'object')
                    .map(member => (member.value as string[])[0])
            )
            return acc
        }, [] as string[])
        computeDepths(childrenIds, depths, depth + 1000)
        return depths
    }

    depths.current[index] ??
        (depths.current[index] = computeDepths(
            stack
                .flatMap(scope => scope.variables)
                .filter(variable => typeof variable.value === 'object')
                .map(variable => (variable.value as [string])[0])
        ))

    return (
        <>
            {Object.keys(heap).map(id => (
                <SvgNode key={id} id={id} graphData={props.graphData}>
                    <Obj id={id} depth={depths.current[index][id]} {...props} />
                </SvgNode>
            ))}
        </>
    )
}
