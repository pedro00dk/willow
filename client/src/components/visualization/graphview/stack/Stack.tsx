import React from 'react'
import { colors } from '../../../../colors'
import { DefaultState } from '../../../../reducers/Store'
import * as tracer from '../../../../types/tracer'
import { Graph } from '../Graph'
import { SvgNode } from '../svg/SvgNode'
import { isSameMember, isValueObject, getMemberName, getDisplayValue, getValueString } from '../TracerUtils'

const styles = {
    edge: (changed: boolean) => (changed ? colors.yellow.darker : colors.gray.dark),
    width: (variableIndex: number, variableDepth: number, stackDepth: number) =>
        variableDepth === stackDepth - 1 ? 2.5 : variableIndex < 2 ? 1 : 0.5
}

export const Stack = (props: { tracer: DefaultState['tracer']; graph: Graph; update: React.Dispatch<{}> }) => {
    const previousStack = React.useRef<tracer.Scope[]>()
    const previousMembers = React.useRef<{ [scope: number]: { [name: string]: tracer.Member } }>({})
    const stack = props.tracer.steps[props.graph.index].snapshot?.stack || []
    const scopesDepths = stack.map((scope, i) => ({ scope, depth: i }))
    const membersDepths = scopesDepths
        .flatMap(({ scope, depth }) => scope.members.map(member => ({ member, depth })))
        .filter(({ member }) => isValueObject(member.value))
    if (stack !== previousStack.current)
        previousMembers.current = membersDepths.reduce((acc, { member, depth }) => {
            if (!acc[depth]) acc[depth] = {}
            acc[depth][getMemberName(member)] = member
            return acc
        }, {} as { [depth: number]: { [name: string]: tracer.Member } })
    previousStack.current = stack

    const deltas = [
        { x: -65, y: -25 },
        { x: -75, y: 0 },
        { x: -65, y: 25 }
    ]

    const idMembers = membersDepths.reduce((acc, { member, depth }, i) => {
        const id = getValueString(member.value)
        if (!acc[id]) acc[id] = []
        acc[id].push({ member, depth })
        return acc
    }, {} as { [id: string]: { member: tracer.Member; depth: number }[] })

    const node = props.graph.getNode('stack')
    Object.entries(idMembers).forEach(([id, variablesDepths]) =>
        variablesDepths
            .slice(-3)
            .reverse()
            .forEach(({ member, depth }, i) => {
                const memberName = getMemberName(member)
                const changed = !isSameMember(member, previousMembers.current[depth]?.[memberName])
                const displayKey = getDisplayValue(member.key)
                props.graph.pushEdge(node.id, `${depth}-${memberName}`, {
                    self: true,
                    target: id,
                    from: { delta: deltas[i], source: 'target' },
                    to: { delta: { x: 0, y: 0 }, source: 'target' },
                    draw: 'line',
                    color: styles.edge(changed),
                    width: styles.width(i, depth, stack.length),
                    text: displayKey
                })
            })
    )

    return <SvgNode id={node.id} graph={props.graph} />
}
