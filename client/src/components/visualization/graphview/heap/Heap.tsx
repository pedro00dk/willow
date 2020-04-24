import React from 'react'
import { DefaultState } from '../../../../reducers/Store'
import { Graph } from '../Graph'
import { SvgNode } from '../svg/SvgNode'
import { getValueString, isValueReference } from '../TracerUtils'
import { Obj } from './Obj'

export const Heap = (props: { tracer: DefaultState['tracer']; graph: Graph; update: React.Dispatch<{}> }) => {
    const { stack = [], heap = {} } = props.tracer.steps[props.graph.index].snapshot ?? {}
    const objectDepths = React.useRef<{ [id: string]: number }[]>([])

    const expandObjectDepths = (roots: { [id: string]: number } = {}) => {
        const depths: typeof roots = {}
        const objects = Object.entries(roots)
        while (objects.length > 0) {
            const [id, depth] = objects.pop()
            if (depths[id] != undefined && depths[id] <= depth) continue
            depths[id] = depth
            heap[id].members.forEach((member, i) => {
                if (!isValueReference(member.value)) return
                const childId = getValueString(member.value)
                const childDepth = depth + (i + 1) * 1e4
                objects.unshift([childId, childDepth])
            })
        }
        return depths
    }

    if (!objectDepths.current[props.graph.index]) {
        const referenceDepths = stack.reduceRight((acc, scope, i) => {
            scope.members.forEach(member => {
                if (!isValueReference(member.value)) return
                const id = getValueString(member.value)
                acc[id] = i * 1e8
            })
            return acc
        }, {} as { [id: string]: number })
        objectDepths.current[props.graph.index] = expandObjectDepths(referenceDepths)
    }

    return (
        <>
            {Object.entries(heap).map(([id, obj]) => {
                const node = props.graph.getNode(id)
                if (node.positions.length === 0) node.centralize(0.75, 'all')
                node.type = obj.type
                node.depth = objectDepths.current[props.graph.index][id]
                return (
                    <SvgNode key={id} id={id} graph={props.graph}>
                        <Obj id={id} obj={obj} node={node} graph={props.graph} update={props.update} />
                    </SvgNode>
                )
            })}
        </>
    )
}
