import React from 'react'
import { colors } from '../../../../colors'
import { DefaultState } from '../../../../reducers/Store'
import * as schema from '../../../../schema/schema'
import { GraphData } from '../GraphData'
import { isValueObject, isSameVariable } from '../SchemaUtils'
import { SvgNode } from '../svg/SvgNode'

const styles = {
    edge: (changed: boolean) => (changed ? colors.yellow.darker : colors.gray.dark)
}

export const Stack = (props: { graphData: GraphData; update: React.Dispatch<{}>; tracer: DefaultState['tracer'] }) => {
    const previousVariables = React.useRef<{ [name: string]: { [depth: number]: schema.Variable } }>({})
    const index = props.graphData.getIndex()
    const { stack = [] } = props.tracer.steps?.[index].snapshot ?? {}
    const variableScopes = stack
        .map((scope, i) => [scope, i] as const)
        .flatMap(([scope, depth]) => scope.variables.map(variable => [variable, depth] as const))
        .filter(([variable]) => isValueObject(variable.value))
    const variablesPerObject = variableScopes.reduce((acc, [variable, depth]) => {
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

    Object.entries(variablesPerObject).forEach(([id, variables]) =>
        variables
            .slice(-3)
            .reverse()
            .forEach(({ variable, depth }, i) => {
                const changed = !isSameVariable(variable, previousVariables.current[variable.name]?.[depth])
                const width = depth === stack.length - 1 ? 2.5 : i < 2 ? 1 : 0.5
                props.graphData.pushEdge('stack', `${depth}-${variable.name}`, {
                    from: { self: true, targetDelta: deltas[i] },
                    to: { targetId: id, mode: 'position' },
                    draw: 'line',
                    color: styles.edge(changed),
                    width,
                    text: variable.name
                })
            })
    )

    React.useEffect(() => {
        previousVariables.current = variableScopes.reduce((acc, [variable, depth]) => {
            const name = variable.name
            if (!acc[name]) acc[name] = {}
            acc[name][depth] = variable
            return acc
        }, {} as { [name: string]: { [depth: number]: schema.Variable } })
    })

    return <>{stack.length > 0 && <SvgNode id='stack' graphData={props.graphData} />}</>
}
