import React from 'react'
import { colors } from '../../../../colors'
import { DefaultState } from '../../../../reducers/Store'
import * as schema from '../../../../schema/schema'
import { GraphData } from '../GraphData'
import { isValueObject, isSameVariable } from '../SchemaUtils'
import { SvgNode } from '../svg/SvgNode'

const styles = {
    color: (changed: boolean) => (changed ? colors.yellow.darker : colors.gray.dark),
    width: (variableIndex: number, variableDepth: number, stackDepth: number) =>
        variableDepth === stackDepth - 1 ? 2.5 : variableIndex < 2 ? 1 : 0.5
}

export const Stack = (props: { tracer: DefaultState['tracer']; graphData: GraphData; update: React.Dispatch<{}> }) => {
    const previousVariables = React.useRef<{ [scopeDepth: number]: { [name: string]: schema.Variable } }>({})
    const available = props.tracer.available
    const stack = (available && props.tracer.steps[props.tracer.index].snapshot?.stack) || []
    const node = props.graphData.getNode('stack')

    const variablesDepths = stack
        .flatMap((scope, i) => scope.variables.map(variable => ({ variable, depth: i })))
        .filter(({ variable }) => isValueObject(variable.value))

    const stackIdsVariablesDepths = variablesDepths.reduce((acc, { variable, depth }, i) => {
        const id = (variable.value as [string])[0]
        if (!acc[id]) acc[id] = []
        acc[id].push({ variable, depth })
        return acc
    }, {} as { [id: string]: { variable: schema.Variable; depth: number }[] })

    const deltas = [
        { x: -65, y: -25 },
        { x: -75, y: 0 },
        { x: -65, y: 25 }
    ]

    Object.entries(stackIdsVariablesDepths).forEach(([id, variablesDepths]) =>
        variablesDepths
            .slice(-3)
            .reverse()
            .forEach(({ variable, depth }, i) => {
                const changed = !isSameVariable(variable, previousVariables.current[depth]?.[variable.name])
                props.graphData.pushEdge(node.id, `${depth}-${variable.name}`, {
                    self: true,
                    target: id,
                    from: { targetDelta: deltas[i] },
                    to: { mode: 'position' },
                    draw: 'line',
                    color: styles.color(changed),
                    width: styles.width(i, depth, stack.length),
                    text: variable.name
                })
            })
    )

    React.useEffect(() => {
        previousVariables.current = variablesDepths.reduce((acc, { variable, depth }) => {
            if (!acc[depth]) acc[depth] = {}
            acc[depth][variable.name] = variable
            return acc
        }, {} as { [depth: number]: { [name: string]: schema.Variable } })
    })

    return <>{available && <SvgNode id={node.id} graphData={props.graphData} />}</>
}
