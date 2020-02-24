import React from 'react'
import { DefaultState } from '../../../../reducers/Store'
import * as schema from '../../../../schema/schema'
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

    // TODO write better implementation
    const computeDepths = (
        current: { id: string; depth: number }[],
        depths: { [id: string]: number } = {}
    ): typeof depths => {
        if (current.length === 0) return depths
        current.flatMap(({ id, depth }) => {
            depths[id] = depth
            return heap[id].members
                .filter(member => isValueObject(member.value) && depths[member.value[0]] == undefined)
                .map((member, i) => ({ id: (member.value as [string])[0], depth: depth + (i + 1) * 1000 }))
                .map(current => computeDepths([current], depths))
        })
        return depths
    }

    if (!depths.current[index]) {
        const variableScopeDepths = Object.values(
            stack
                .flatMap((scope, i) => scope.variables.map(variable => ({ variable, scopeDepth: i * 1000000 })))
                .filter(({ variable }) => isValueObject(variable.value))
                .reduce((acc, { variable, scopeDepth }) => {
                    const id = (variable.value as [string])[0]
                    if (!acc[id] || acc[id].depth > scopeDepth) acc[id] = { id, depth: scopeDepth }
                    return acc
                }, {} as { [id: string]: { id: string; depth: number } })
        )
        depths.current[index] = computeDepths(variableScopeDepths)
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
