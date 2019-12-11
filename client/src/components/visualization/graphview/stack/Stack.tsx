import React from 'react'
import { DefaultState } from '../../../../reducers/Store'
import { GraphData } from '../GraphData'

export const Stack = (props: {
    graphData: GraphData
    forceUpdate: React.Dispatch<{}>
    tracer: DefaultState['tracer']
}) => {
    if (!props.tracer.steps) return <></>
    const deltaSize = props.graphData.getGraphSize().x * 0.04
    const stack = props.tracer.steps[props.graphData.getIndex()].snapshot?.stack ?? []
    const variables = stack
        .flatMap(scope => scope.variables)
        .filter(variable => typeof variable.value === 'object')
        .reduce((acc, next) => {
            const id = (next.value as [string])[0]
            if (!acc[id]) acc[id] = []
            if (acc[id].length > 3) return acc
            acc[id].push(next.name)
            return acc
        }, {} as { [id: string]: string[] })

    Object.entries(variables).forEach(([id, names]) =>
        names.forEach((name, i) => {
            const angle = (i * 20 + 5) * (Math.PI / 180)
            const delta = { x: deltaSize * Math.cos(angle), y: deltaSize * -Math.sin(angle) }
            props.graphData.getTargets(id).push({ target: id, delta, text: name })
        })
    )

    return <></>
}
