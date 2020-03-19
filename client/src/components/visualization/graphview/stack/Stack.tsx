import React from 'react'
import { colors } from '../../../../colors'
import { DefaultState } from '../../../../reducers/Store'
import * as tracer from '../../../../types/tracer'
import { Graph } from '../Graph'
import { SvgNode } from '../svg/SvgNode'
import { isSameMember, isValueObject, getMemberName, getDisplayValue } from '../TracerUtils'

const styles = {
    color: (changed: boolean) => (changed ? colors.yellow.darker : colors.gray.dark),
    width: (variableIndex: number, variableDepth: number, stackDepth: number) =>
        variableDepth === stackDepth - 1 ? 2.5 : variableIndex < 2 ? 1 : 0.5
}

export const Stack = (props: { tracer: DefaultState['tracer']; graphData: Graph; update: React.Dispatch<{}> }) => {
    const previousMembers = React.useRef<{ [scope: number]: { [name: string]: tracer.Member } }>({})
    const available = props.tracer.available
    const stack = (available && props.tracer.steps[props.tracer.index].snapshot?.stack) || []
    const node = props.graphData.getNode('stack')

    const membersDepths = stack
        .flatMap((scope, i) => scope.members.map(member => ({ member, depth: i })))
        .filter(({ member }) => isValueObject(member.value))

    const stackIdsMembersDepths = membersDepths.reduce((acc, { member, depth }, i) => {
        const id = (member.value as [string])[0]
        if (!acc[id]) acc[id] = []
        acc[id].push({ member, depth })
        return acc
    }, {} as { [id: string]: { member: tracer.Member; depth: number }[] })

    const deltas = [
        { x: -65, y: -25 },
        { x: -75, y: 0 },
        { x: -65, y: 25 }
    ]

    Object.entries(stackIdsMembersDepths).forEach(([id, variablesDepths]) =>
        variablesDepths
            .slice(-3)
            .reverse()
            .forEach(({ member, depth }, i) => {
                const memberName = getMemberName(member)
                const changed = !isSameMember(member, previousMembers.current[depth]?.[memberName])
                const displayKey = getDisplayValue(member.key)
                props.graphData.pushEdge(node.id, `${depth}-${memberName}`, {
                    self: true,
                    target: id,
                    from: { targetDelta: deltas[i] },
                    to: { mode: 'position' },
                    draw: 'line',
                    color: styles.color(changed),
                    width: styles.width(i, depth, stack.length),
                    text: displayKey
                })
            })
    )

    React.useEffect(() => {
        previousMembers.current = membersDepths.reduce((acc, { member, depth }) => {
            if (!acc[depth]) acc[depth] = {}
            acc[depth][getMemberName(member)] = member
            return acc
        }, {} as { [depth: number]: { [name: string]: tracer.Member } })
    })

    return <>{available && <SvgNode id={node.id} graphData={props.graphData} />}</>
}
