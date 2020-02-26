import React from 'react'
import { DefaultState } from '../../../../reducers/Store'
import { GraphData } from '../GraphData'
import { isValueObject } from '../SchemaUtils'
import { SvgNode } from '../svg/SvgNode'
import { Obj } from './Obj'

export const Heap = (props: { tracer: DefaultState['tracer']; graphData: GraphData; update: React.Dispatch<{}> }) => {
    const idsDepths = React.useRef<{ [id: string]: number }[]>([])
    const available = props.tracer.available
    const index = props.tracer.index
    const { stack = [], heap = {} } = (available && props.tracer.steps[index].snapshot) || {}
    if (!available) idsDepths.current = []

    const computeIdsDepths = (roots: { [id: string]: number }, depths: { [id: string]: number } = {}) => {
        Object.entries(roots)
            .filter(([id]) => depths[id] == undefined)
            .forEach(([id, depth]) => {
                depths[id] = depth
                const childRoots = heap[id].members
                    .filter(member => isValueObject(member.value))
                    .reduce((acc, member, i) => {
                        const id = (member.value as [string])[0]
                        acc[id] = depth + (i + 1) * 1000
                        return acc
                    }, {} as { [id: string]: number })
                computeIdsDepths(childRoots, depths)
            })
        return depths
    }

    if (!idsDepths.current[index]) {
        const stackIdsDepths = stack.reduceRight((acc, scope, i) => {
            scope.members.forEach(member => {
                if (!isValueObject(member.value)) return
                const id = (member.value as [string])[0]
                acc[id] = i * 1000000
            })
            return acc
        }, {} as { [id: string]: number })
        idsDepths.current[index] = computeIdsDepths(stackIdsDepths)
    }

    return (
        <>
            {Object.entries(heap).map(([id, obj]) => {
                const node = props.graphData.getNode(id)
                node.type = obj.type
                node.depth = idsDepths.current[index][id]
                return (
                    <SvgNode key={id} id={id} graphData={props.graphData}>
                        <Obj id={id} obj={obj} node={node} graphData={props.graphData} update={props.update} />
                    </SvgNode>
                )
            })}
        </>
    )
}
