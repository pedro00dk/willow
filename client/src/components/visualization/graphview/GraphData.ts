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

    getNodeChildren(node: Node, depth = 0, skipParent = false, pool: { [id: string]: Node } = {}) {
        if (depth < 0 || pool[node.id]) return pool
        if (!skipParent) pool[node.id] = node
        Object.values(this.getEdges(node.id))
            .filter(edge => (edge.from as any).delta && (edge.to as any).targetId != undefined)
            .forEach(edge => this.getNodeChildren(this.getNode((edge.to as any).targetId), depth - 1, false, pool))
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
        Object.values(children).forEach(child => {
            const position = this.getNodePosition(child, baseIndex)
            this.setNodePositions(child, { x: position.x + delta.x, y: position.y + delta.y }, range)
        })
        return children
    }

    findNodeStructure(
        node: Node,
        parent: Node = undefined,
        depth = 0,
        structure = {
            members: {} as { [id: string]: Node },
            links: {} as { [id: string]: Node[] },
            base: undefined as Node,
            count: 0,
            depth: 0,
            type: 'unknown' as 'node' | 'list' | 'tree' | 'unknown',
            hasCycleEdge: false,
            hasParentEdge: false,
            hasCrossEdge: false
        }
    ) {
        if (structure.members[node.id]) return
        structure.members[node.id] = node
        structure.links[node.id] = []
        if (parent) structure.links[parent.id].push(node)
        structure.base = node.depth < (structure.base?.depth ?? Infinity) ? node : structure.base
        structure.count++
        structure.depth = Math.max(structure.depth, depth)
        structure.type =
            structure.count === 1
                ? 'node'
                : structure.count === structure.depth + 1
                ? 'list'
                : !structure.hasCrossEdge
                ? 'tree'
                : 'unknown'

        // TODO also get parents
        Object.values(this.getNodeChildren(node, 1, true))
            .filter(child => child.type === node.type)
            .forEach(child => {
                if (!structure.members[child.id]) return this.findNodeStructure(child, node, depth + 1, structure)
                structure.hasCycleEdge = structure.hasCycleEdge || child.id === node.id
                structure.hasParentEdge = structure.hasParentEdge || child.id === parent.id
                structure.hasCrossEdge = structure.hasCrossEdge || (child.id !== node.id && child.id !== parent.id)
            })
        return structure
    }

    computeNodeLayout(
        structure: ReturnType<GraphData['findNodeStructure']>,
        horizontal: boolean,
        increment: { x: number; y: number },
        positions: { [id: string]: { x: number; y: number } } = {},
        node = structure.base,
        depth = { x: 0, y: 0 }
    ) {
        if (positions[node.id]) return [positions, depth] as const
        positions[node.id] = { x: 0, y: 0 }

        const childrenEndDepth = structure.links[node.id].reduce(
            (acc, child) => {
                const childDepth = { x: acc.x + Number(horizontal), y: acc.y + Number(!horizontal) }
                const [, childEndDepth] = this.computeNodeLayout(
                    structure,
                    horizontal,
                    increment,
                    positions,
                    child,
                    childDepth
                )
                return childEndDepth
            },
            { ...depth }
        )

        const isLeaf = horizontal ? depth.y === childrenEndDepth.y : depth.x === childrenEndDepth.x
        positions[node.id].x = increment.x * (horizontal || isLeaf ? depth.x : (depth.x + childrenEndDepth.x - 1) / 2)
        positions[node.id].y = increment.y * (!horizontal || isLeaf ? depth.y : (depth.y + childrenEndDepth.y - 1) / 2)
        const endDepth: typeof depth = {
            x: childrenEndDepth.x + (horizontal ? -1 : isLeaf ? 1 : 0),
            y: childrenEndDepth.y + (!horizontal ? -1 : isLeaf ? 1 : 0)
        }

        if (node === structure.base) {
            const originDelta = { x: -positions[node.id].x, y: -positions[node.id].y }
            Object.values(positions).forEach(position => ((position.x += originDelta.x), (position.y += originDelta.y)))
        }

        return [positions, endDepth] as const
    }

    applyNodeAutoLayout(
        node: Node,
        direction = 'horizontal' as 'horizontal' | 'vertical',
        incrementRatio = { x: 1.5, y: 1.5 },
        baseIndex = this.index,
        range = [this.index, this.index] as const
    ) {
        const structure = this.findNodeStructure(node)
        if (structure.type === 'unknown') return
        const anchor = this.getNodePosition(node, baseIndex)
        const sizeAnchor = this.getNodeSize(node, baseIndex)
        const increment = { x: sizeAnchor.x * incrementRatio.x, y: sizeAnchor.y * incrementRatio.y }

        const [positions] = this.computeNodeLayout(structure, direction === 'horizontal', increment)

        Object.entries(positions).forEach(([id, delta]) =>
            this.setNodePositions(this.getNode(id), { x: anchor.x + delta.x, y: anchor.y + delta.y }, range)
        )
        return structure
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
}
