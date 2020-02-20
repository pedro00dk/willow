import React from 'react'
import { DefaultState } from '../../../../reducers/Store'
import { GraphData } from '../GraphData'
import { isValueObject } from '../SchemaUtils'
import { SvgNode } from '../svg/SvgNode'
import { Obj } from './Obj'

export const Heap = (props: { tracer: DefaultState['tracer']; graphData: GraphData; update: React.Dispatch<{}> }) => {
    const depths = React.useRef<{ [id: string]: number }[]>([])
    const available = props.tracer.available
    const index = props.tracer.index
    const { stack = [], heap = {} } = (available && props.tracer.steps[index].snapshot) || {}

    React.useMemo(() => (depths.current = []), [available])

    const computeDepths = (ids: string[], depth = 0, depths: { [id: string]: number } = {}): typeof depths => {
        if (ids.length === 0) return depths
        const childrenIds = ids.reduce((acc, id, i) => {
            if (depths[id] != undefined) return acc
            depths[id] = depth + i
            heap[id].members.forEach(member => isValueObject(member.value) && acc.push(member.value[0]))
            return acc
        }, [] as string[])
        return computeDepths(childrenIds, depth + 1000, depths)
    }

    if (!depths.current[index]) {
        const ids = stack
            .flatMap(scope => scope.variables)
            .filter(variable => isValueObject(variable.value))
            .map(variable => (variable.value as [string])[0])
        depths.current[index] = computeDepths(ids)
    }

    return (
        <>
            {Object.entries(heap).map(([id, obj]) => {
                const node = props.graphData.getNode(id)
                node.type = obj.lType
                node.depth = depths.current[index][id]
                return (
                    <SvgNode key={id} id={id} graphData={props.graphData}>
                        <Obj id={id} obj={obj} node={node} graphData={props.graphData} update={props.update} />
                    </SvgNode>
                )
            })}
        </>
    )
}
