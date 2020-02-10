import { colors } from '../../../colors'

export type DefaultParameters = {
    [name: string]:
        | { value: boolean }
        | { value: number; range: [number, number] }
        | { value: string; options: string[] }
}

export type UnknownParameters = { [name: string]: DefaultParameters[keyof DefaultParameters]['value'] }

export type ComputedParameters<T extends DefaultParameters> = { [name in keyof T]: T[name]['value'] }

export const readParameters = <T extends UnknownParameters, U extends DefaultParameters>(parameters: T, defaults: U) =>
    Object.fromEntries(
        Object.entries(defaults).map(([name, defaults]) =>
            !parameters
                ? [name, defaults.value]
                : typeof parameters[name] !== typeof defaults.value
                ? [name, defaults.value]
                : [name, parameters[name]]
        )
    ) as ComputedParameters<U>

export type Node = {
    id: string
    render: boolean
    positions: { x: number; y: number }[]
    sizes: { x: number; y: number }[]
    depth: number
    type: string
    mode: 'own' | 'type'
    shape: { own: string; type: string }
    parameters: { own: UnknownParameters; type: UnknownParameters }
}

export type Edge = {
    id: string
    color: string
    width: number
    text: string
    draw: 'line' | 'curve'
    from:
        | { delta: { x: number; y: number } }
        | { targetDelta: { x: number; y: number } }
        | { point: { x: number; y: number } }
    to:
        | { targetId: string; mode: 'position' | 'size' | 'center' | 'third' | 'quarter' | 'corner' | 'nearest' }
        | { targetId: string; delta: { x: number; y: number } }
        | { point: { x: number; y: number } }
}

export const lerp = (from: number, to: number, gradient: number) => from * (1 - gradient) + to * gradient

export const ilerp = (value: number, from: number, to: number) => (value - from) / (to - from)

export const svgScreenTransformPoint = (
    direction: 'toSvg' | 'toScreen',
    svgElement: SVGGraphicsElement,
    ...points: { x: number; y: number }[]
) => {
    const toScreenTransformMatrix = svgElement.getScreenCTM()
    const matrix = direction === 'toSvg' ? toScreenTransformMatrix.inverse() : toScreenTransformMatrix
    return points.map(point => new DOMPoint(point.x, point.y).matrixTransform(matrix) as { x: number; y: number })
}

export const svgScreenTransformVector = (
    direction: 'toSvg' | 'toScreen',
    svgElement: SVGGraphicsElement,
    ...vectors: { x: number; y: number }[]
) => {
    const [root, ...shiftedVectors] = svgScreenTransformPoint(direction, svgElement, { x: 0, y: 0 }, ...vectors)
    shiftedVectors.forEach(vector => ((vector.x -= root.x), (vector.y -= root.y)))
    return shiftedVectors
}

export class GraphData {
    private index: number = 0
    private animate: boolean = true
    private viewBox: { x: number; y: number; width: number; height: number } = { x: 0, y: 0, width: 0, height: 0 }
    private subscriptionCalls = 0
    private subscriptions: { [id: string]: ((subscriptionIndex: number) => void)[] } = {}
    private nodes: { [id: string]: Node } = {}
    private edges: { [id: string]: Edge[] } = {}

    constructor(private viewSize: { width: number; height: number }, private viewPadding: { x: number; y: number }) {}

    getIndex() {
        return this.index
    }

    setIndex(index: number) {
        return (this.index = index)
    }

    getAnimate() {
        return this.animate
    }

    setAnimate(animate: boolean) {
        return (this.animate = animate)
    }

    getViewBox() {
        return this.viewBox
    }

    setViewBox(viewBox: { x: number; y: number; width: number; height: number }) {
        return (this.viewBox = viewBox)
    }

    getViewSize() {
        return this.viewSize
    }

    getViewPadding() {
        return this.viewPadding
    }

    subscribe(id: string, callback: (subscriptionCall: number) => void) {
        const subscriptions = this.subscriptions[id] ?? (this.subscriptions[id] = [])
        subscriptions.push(callback)
    }

    callSubscriptions(id?: string) {
        const callId = this.subscriptionCalls++
        if (id != undefined) return this.subscriptions[id]?.forEach(subscription => subscription(callId))
        Object.values(this.subscriptions).forEach(subscriptions =>
            subscriptions.forEach(subscription => subscription(callId))
        )
    }

    clearSubscriptions() {
        this.subscriptions = {}
    }

    getNode(id: string, partialNode: Partial<Node> = {}) {
        return (
            this.nodes[id] ??
            (this.nodes[id] = {
                id,
                render: partialNode.render ?? true,
                positions: partialNode.positions ?? [],
                sizes: partialNode.sizes ?? (partialNode.sizes = []),
                depth: partialNode.depth ?? 0,
                type: partialNode.type ?? '',
                mode: partialNode.mode ?? 'own',
                shape: partialNode.shape ?? { own: '', type: '' },
                parameters: partialNode.parameters ?? { own: {}, type: {} }
            })
        )
    }

    hasNode(id: string) {
        return !!this.nodes[id]
    }

    clearRenders() {
        Object.values(this.nodes).forEach(node => (node.render = true))
    }

    clearNodes() {
        this.nodes = {}
    }

    getEdges(id: string) {
        return this.edges[id] ?? (this.edges[id] = [])
    }

    pushEdge(id: string, partialEdge: Partial<Edge> = {}) {
        this.getEdges(id).push({
            id,
            color: partialEdge.color ?? colors.gray.dark,
            width: partialEdge.width ?? 1,
            text: partialEdge.text ?? '',
            draw: partialEdge.draw ?? 'curve',
            from: partialEdge.from ?? { point: { x: 0, y: 0 } },
            to: partialEdge.to ?? { point: { x: 0, y: 0 } }
        })
    }

    clearEdges() {
        this.edges = {}
    }

    // Node helper methods

    getNodePosition(node: Node, index: number = this.index) {
        return node.positions[index] ?? this.setNodePositions(node, { x: 0, y: 0 }, [index, index])
    }

    setNodePositions(node: Node, position: { x: number; y: number }, range = [this.index, this.index] as const) {
        const padPosition = {
            x: Math.min(Math.max(position.x, 0), this.viewSize.width - this.viewPadding.x),
            y: Math.min(Math.max(position.y, 0), this.viewSize.height - this.viewPadding.y)
        }
        for (let i = range[0]; i <= range[1]; i++) node.positions[i] = padPosition
        return padPosition
    }

    getNodeSize(node: Node, index = this.index) {
        return node.sizes[index] ?? this.setNodeSizes(node, { x: 0, y: 0 }, [index, index])
    }

    setNodeSizes(node: Node, size: { x: number; y: number }, range = [this.index, this.index] as const) {
        for (let i = range[0]; i <= range[1]; i++) node.sizes[i] = size
        return size
    }
    getNodeChildren(node: Node, depth = 0, pool: { [id: string]: Node } = {}) {
        if (depth < 0 || pool[node.id]) return pool
        pool[node.id] = node
        Object.values(this.getEdges(node.id))
            .filter(edge => (edge.from as any).delta && (edge.to as any).targetId != undefined)
            .forEach(edge => this.getNodeChildren(this.getNode((edge.to as any).targetId), depth - 1, pool))
        return pool
    }

    moveNodePositions(
        node: Node,
        delta: { x: number; y: number },
        depth = 0,
        baseIndex = this.index,
        range = [this.index, this.index] as const
    ) {
        const children = this.getNodeChildren(node, depth)
        Object.values(children).forEach(node => {
            const position = this.getNodePosition(node, baseIndex)
            this.setNodePositions(node, { x: position.x + delta.x, y: position.y + delta.y }, range)
        })
        return children
    }

    // Edge helper methods

    computeEdgeStartPoint(edge: Edge) {
        const delta = (edge.from as any).delta as { x: number; y: number }
        const targetDelta = (edge.from as any).targetDelta as { x: number; y: number }
        const point = (edge.from as any).point as { x: number; y: number }
        if (delta) {
            const sourceNode = this.getNode(edge.id)
            const sourcePosition = this.getNodePosition(sourceNode)
            return { x: sourcePosition.x + delta.x, y: sourcePosition.y + delta.y }
        } else if (targetDelta) {
            const targetId = (edge.to as any).targetId as string
            if (targetId != undefined) {
                const targetNode = this.getNode(edge.id)
                const targetPosition = this.getNodePosition(targetNode)
                return { x: targetPosition.x + delta.x, y: targetPosition.y + delta.y }
            } else {
                const targetPoint = (edge.to as any).point as { x: number; y: number }
                return { x: targetPoint.x + delta.x, y: targetPoint.y + delta.y }
            }
        } else return point
    }

    computeEdgeEndPoint(edge: Edge, startPoint = this.computeEdgeStartPoint(edge)) {
        const targetId = (edge.to as any).targetId as string
        const mode = (edge.to as any).mode as string
        const delta = (edge.to as any).delta as { x: number; y: number }
        const point = (edge.to as any).point as { x: number; y: number }
        if (targetId != undefined) {
            const targetNode = this.getNode(targetId)
            const targetPosition = this.getNodePosition(targetNode)
            const targetSize = this.getNodeSize(targetNode)
            if (mode != undefined) {
                switch (mode) {
                    case 'nearest': // TODO implement other cases
                    default:
                        return {
                            x: Math.min(Math.max(startPoint.x, targetPosition.x), targetPosition.x + targetSize.x),
                            y: Math.min(Math.max(startPoint.y, targetPosition.y), targetPosition.y + targetSize.y)
                        }
                }
            } else return { x: targetPosition.x + delta.x, y: targetPosition.y + delta.y }
        } else return point
    }

    computeEdgeCurvatureControlPoint(
        edge: Edge,
        ratio: number,
        startPoint = this.computeEdgeStartPoint(edge),
        endPoint = this.computeEdgeEndPoint(edge, startPoint)
    ) {
        const centerPoint = { x: lerp(startPoint.x, endPoint.x, 0.5), y: lerp(startPoint.y, endPoint.y, 0.5) }
        if (edge.draw === 'line') return centerPoint
        const parallelVector = { x: endPoint.x - startPoint.x, y: endPoint.y - startPoint.y }
        const orthogonalVector = { x: parallelVector.y * ratio, y: -parallelVector.x * ratio }
        const controlPoint = { x: centerPoint.x + orthogonalVector.x, y: centerPoint.y + orthogonalVector.y }
        return controlPoint
    }

    computeEdgePathData(edge: Edge) {
        const startPoint = this.computeEdgeStartPoint(edge)
        const endPoint = this.computeEdgeEndPoint(edge, startPoint)
        const controlPoint = this.computeEdgeCurvatureControlPoint(edge, 0.1, startPoint, endPoint)
        return `M ${startPoint.x},${startPoint.y} Q ${controlPoint.x},${controlPoint.y} ${endPoint.x},${endPoint.y}`
    }

    // findNodeStructure(node: Node) {

    // }

    // postLayout(
    //     id: string,
    //     obj: schema.Obj,
    //     depth = { x: 0, y: 0 },
    //     positions: { [id: string]: { x: number; y: number } } = {}
    // ) {
    //     if (positions[id]) return [positions, depth] as const
    //     positions[id] = { x: 0, y: 0 }

    //     const newDepth = { ...depth }
    //     obj.members
    //         .filter(member => typeof member.value === 'object' && structure.members.has(member.value[0]))
    //         .forEach(member => {
    //             const [, updatedDepth] = postLayout(
    //                 (member.value as [string])[0],
    //                 heap[(member.value as [string])[0]],
    //                 { x: newDepth.x + Number(horizontal), y: newDepth.y + Number(!horizontal) },
    //                 positions
    //             )
    //             newDepth.x = updatedDepth.x
    //             newDepth.y = updatedDepth.y
    //         })
    //     const isLeaf = horizontal ? newDepth.y === depth.y : newDepth.x === depth.x
    //     positions[id].x =
    //         positionAnchor.x + increment.x * (horizontal || isLeaf ? depth.x : (depth.x + newDepth.x - 1) / 2)
    //     positions[id].y =
    //         positionAnchor.y + increment.y * (!horizontal || isLeaf ? depth.y : (depth.y + newDepth.y - 1) / 2)
    //     const finalDepth = {
    //         x: newDepth.x + (horizontal ? -1 : isLeaf ? 1 : 0),
    //         y: newDepth.y + (!horizontal ? -1 : isLeaf ? 1 : 0)
    //     }
    //     return [positions, finalDepth] as const
    // }

    // autoLayout(
    //     node: Node,
    //     direction: 'horizontal' | 'vertical',
    //     incrementRatio: { x: number; y: number },
    //     range: [number, number]
    // ) {
    //     const groupData = props.tracer.groupsData[index]
    //     const structure = groupData[id]
    //     if (!structure || structure.type === 'unknown') return
    //     const positionAnchor = props.graphData.getNodePosition(id, index)
    //     const sizeAnchor = props.graphData.getNodeSize(id, index)
    //     const increment = { x: sizeAnchor.x * 1.5, y: sizeAnchor.y * 1.5 }
    //     const range = [update === 'all' ? 0 : index, props.tracer.steps.length] as [number, number]

    //     const [positions] = postLayout(structure.base, heap[structure.base])
    //     const basePosition = positions[structure.base]
    //     const baseDelta = { x: positionAnchor.x - basePosition.x, y: positionAnchor.y - basePosition.y }
    //     props.graphData.setAnimate(true)
    //     Object.entries(positions).forEach(([id, position]) => {
    //         position.x += baseDelta.x
    //         position.y += baseDelta.y
    //         props.graphData.setNodePositions(id, range, position)
    //     })
    //     Object.keys(positions).forEach(id => props.graphData.callSubscriptions(id))
    // }
}
// export type GroupData = {
//     [id: string]: StructureData
// }

// export type StructureData = {
//     base: string
//     depth: number
//     members: Set<string>
//     hasCycleEdge: boolean
//     hasParentEdge: boolean
//     hasCrossEdge: boolean
//     type: 'node' | 'list' | 'tree' | 'unknown'
// }

// // type State = {
//     fetching: boolean
//     index?: number
//     steps?: schema.Step[]
//     groupsData?: GroupData[]
//     error?: string
// }
// const buildStructureData = (
//     heap: schema.Snapshot['heap'],
//     id: string,
//     parentId: string,
//     depth: number,
//     structureData: StructureData
// ) => {
//     structureData.members.add(id)
//     structureData.depth = Math.max(structureData.depth, depth)
//     structureData.type =
//         structureData.members.size === 1
//             ? 'node'
//             : structureData.members.size === structureData.depth
//             ? 'list'
//             : !structureData.hasCrossEdge
//             ? 'tree'
//             : 'unknown'
//     heap[id].members
//         .filter(member => typeof member.value === 'object' && heap[member.value[0]].lType === heap[id].lType)
//         .map(member => (member.value as [string])[0])
//         .forEach(memberId => {
//             if (!structureData.members.has(memberId))
//                 return buildStructureData(heap, memberId, id, depth + 1, structureData)
//             structureData.hasCycleEdge = structureData.hasCycleEdge || memberId === id
//             structureData.hasParentEdge = structureData.hasParentEdge || memberId === parentId
//             structureData.hasCrossEdge = structureData.hasCrossEdge || (memberId !== id && memberId !== parentId)
//         })
//     return structureData
// }

// const buildGroupsData = (steps: schema.Step[]) => {
//     let previous: GroupData = {}
//     return steps.map(({ snapshot }, i) => {
//         if (!snapshot) return previous
//         const groupData: GroupData = {}
//         const references = snapshot.stack
//             .flatMap(scope => scope.variables)
//             .filter(variable => typeof variable.value === 'object')
//             .map(variable => (variable.value as [string])[0])
//             .map(id => [id, snapshot.heap[id].members] as const)
//             .map(([id, members]) => [id, members.filter(member => typeof member.value === 'object')] as const)
//             .flatMap(([id, members]) => [id, ...members.map(member => (member.value as [string])[0])])
//         const heap = snapshot?.heap ?? {}
//         new Set(references).forEach(id => {
//             if (groupData[id]) return
//             const structureData = buildStructureData(heap, id, undefined, 1, {
//                 base: id,
//                 depth: 0,
//                 members: new Set(),
//                 hasCycleEdge: false,
//                 hasParentEdge: false,
//                 hasCrossEdge: false,
//                 type: 'unknown'
//             })
//             structureData.members.forEach(id => (groupData[id] = structureData))
//         })
//         return (previous = groupData)
//     })
// }
