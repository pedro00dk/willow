import React from 'react'
import { colors } from '../../../../colors'
import { DefaultState } from '../../../../reducers/Store'
import * as tracer from '../../../../types/tracer'
import { Graph } from '../Graph'
import { SvgNode } from '../svg/SvgNode'
import { getValueString, isSameMember, isValueReference } from '../TracerUtils'

const styles = {
    edgeColor: (changed: boolean) => (changed ? colors.yellow.darker : colors.gray.dark),
    edgeWidth: (index: number, scopeDepth: number, stackLength: number) =>
        scopeDepth === stackLength - 1 ? 2.5 : index < 2 ? 1 : 0.5
}

export const Stack = (props: { tracer: DefaultState['tracer']; graph: Graph; update: React.Dispatch<{}> }) => {
    const node = props.graph.getNode('stack')
    const stack = props.tracer.steps[props.graph.index].snapshot?.stack || []
    const referenceMembers = stack.reduce((acc, scope, i) => {
        scope.members.forEach(member => {
            if (!isValueReference(member.value)) return
            const id = getValueString(member.value)
            const key = getValueString(member.key)
            if (!acc[id]) acc[id] = {}
            if (!acc[id][i]) acc[id][i] = {}
            acc[id][i][key] = member
        })
        return acc
    }, {} as { [id: string]: { [scope: string]: { [key: string]: tracer.Member } } })
    const previousReferenceMembers = React.useRef<typeof referenceMembers>({})

    React.useEffect(() => {
        previousReferenceMembers.current = referenceMembers
    }, [stack])

    const edgeDelta = (size: number, angle: number) => ({ x: -size * Math.cos(angle), y: -size * Math.sin(angle) })

    Object.entries(referenceMembers).forEach(([id, members]) => {
        const displayMembers = Object.entries(members)
            .flatMap(([scope, keys]) => Object.entries(keys).flatMap(([key, member]) => ({ scope, key, member })))
            .slice(-3)
        displayMembers.forEach(({ scope, key, member }, i) => {
            const edgeId = `${scope}-${key}`
            const changed = !isSameMember(member, previousReferenceMembers.current[id]?.[scope]?.[key])
            props.graph.pushEdge(node.id, edgeId, {
                target: id,
                from: { delta: edgeDelta(80, i * 15 * (Math.PI / 180)), source: 'target' },
                to: { delta: { x: 0, y: 0 }, source: 'target' },
                shape: 'line',
                color: styles.edgeColor(changed),
                width: styles.edgeWidth(i, parseInt(scope), stack.length),
                text: key
            })
        })
    })

    return <SvgNode id={node.id} graph={props.graph} />
}
