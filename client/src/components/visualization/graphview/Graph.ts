// Math and svg transform helper functions

export const lerp = (from: number, to: number, gradient: number) => from * (1 - gradient) + to * gradient

export const ilerp = (value: number, from: number, to: number) => (value - from) / (to - from)

export const svgScreenTransformPoint = (
    direction: 'toSvg' | 'toScreen',
    svgElement: SVGGraphicsElement,
    zoom: boolean,
    ...points: { x: number; y: number }[]
) => {
    const toScreenTransformMatrix = svgElement.getScreenCTM()
    let matrix = direction === 'toSvg' ? toScreenTransformMatrix.inverse() : toScreenTransformMatrix
    if (zoom) matrix = matrix.scale(1 / globalThis.devicePixelRatio, 1 / globalThis.devicePixelRatio)
    return points.map(point => new DOMPoint(point.x, point.y).matrixTransform(matrix) as { x: number; y: number })
}

export const svgScreenTransformVector = (
    direction: 'toSvg' | 'toScreen',
    svgElement: SVGGraphicsElement,
    zoom: boolean,
    ...vectors: { x: number; y: number }[]
) => {
    const [root, ...shiftedVectors] = svgScreenTransformPoint(direction, svgElement, zoom, { x: 0, y: 0 }, ...vectors)
    shiftedVectors.forEach(vector => ((vector.x -= root.x), (vector.y -= root.y)))
    return shiftedVectors
}

// GraphData component types definitions

export type Node = {
    readonly id: string
    render: boolean
    positions: { x: number; y: number }[]
    size: { x: number; y: number }
    depth: number
    type: string
    mode: 'own' | 'type'
    shape: string
    parameters: NodeParameters
    layout: {
        position: { x: number; y: number }
        parameters: ComputedParameters<typeof layoutParameters>
    }
}

export type NodeType = {
    shape: string
    parameters: NodeParameters
}

export type NodeEdges = { children: Edge[]; parents: Edge[]; loose: Edge[] }

export type NodeParameters = {
    [shape: string]: UnknownParameters
}

export type ShapeParameters = {
    [name: string]:
        | { value: boolean; bool: true }
        | { value: number; range: [number, number] }
        | { value: string; options: string[] }
        | { value: string | undefined; members: 'all' | 'values' | 'references' }
}

export type UnknownParameters = { [name: string]: ShapeParameters[keyof ShapeParameters]['value'] }

export type ComputedParameters<T extends ShapeParameters> = { [name in keyof T]: T[name]['value'] }

export type Edge = Readonly<{
    id: string
    name: string
    self: boolean
    target: string
    from:
        | { delta: { x: number; y: number } }
        | { targetDelta: { x: number; y: number } }
        | { point: { x: number; y: number } }
    to:
        | { delta: { x: number; y: number } }
        | { mode: 'position' | 'size' | 'center' | 'corner' | 'near' }
        | { point: { x: number; y: number } }
    draw: 'line' | 'curve'
    width: number
    color: string
    text: string
}>

export type Structure = {
    members: { [id: string]: Node }
    links: { [id: string]: { children: Node[]; parents: Node[] } }
    base: Node
    size: number
    depth: number
    hasCycleEdge: boolean
    hasParentEdge: boolean
    hasCrossEdge: boolean
}

// Default object creation functions for defined types

const createBaseNode = (id: string): Node => ({
    id,
    render: true,
    positions: [],
    size: { x: 0, y: 0 },
    depth: undefined,
    type: undefined,
    mode: 'type',
    shape: undefined,
    parameters: {},
    layout: {
        position: undefined,
        parameters: readParameters(undefined, layoutParameters)
    }
})

const createBaseNodeType = (): NodeType => ({
    shape: undefined,
    parameters: {}
})

const createBaseNodeEdges = (): NodeEdges => ({ children: [], parents: [], loose: [] })

const createBaseEdge = (id: string, name: string): Edge => ({
    id,
    name,
    self: true,
    target: undefined,
    from: { point: { x: 0, y: 0 } },
    to: { point: { x: 0, y: 0 } },
    draw: 'curve',
    width: 1,
    color: 'black',
    text: undefined
})

const createBaseStructure = (): Structure => ({
    members: {},
    links: {},
    base: undefined,
    size: 0,
    depth: 0,
    hasCycleEdge: false,
    hasParentEdge: false,
    hasCrossEdge: false
})

// Helper objects and functions for Parameters and Layout components of Node

export const layoutParameters = {
    automatic: { value: false, bool: true as const },
    direction: { value: 'horizontal', options: ['horizontal', 'vertical'] },
    member: { value: undefined as string, members: 'all' as const }
}

export const readParameters = <T extends UnknownParameters, U extends ShapeParameters>(parameters: T, defaults: U) =>
    Object.fromEntries(
        Object.entries(defaults).map(([name, def]) => [name, parameters ? parameters[name] : def.value])
    ) as ComputedParameters<U>

// GraphData computes all manipulations in the Graph visualization

class View {
    constructor(
        public size: { width: number; height: number } = { width: Infinity, height: Infinity },
        public padding: { right: number; bottom: number } = { right: 0, bottom: 0 },
        public box: { x: number; y: number; width: number; height: number } = { x: 0, y: 0, width: 0, height: 0 }
    ) {}

    getCenter() {
        return { x: this.box.x + this.box.width / 2, y: this.box.y + this.box.height / 2 }
    }

    padPoint(point: { x: number; y: number }) {
        return {
            x: Math.min(Math.max(point.x, 0), this.size.width - this.padding.right),
            y: Math.min(Math.max(point.y, 0), this.size.height - this.padding.bottom)
        }
    }
}

export class Graph {
    view: View = new View()
    private index: number = 0
    private size: number = 0
    private animate: boolean = true
    private subscriptions: { [id: string]: (() => void)[] } = {}
    private nodes: { [id: string]: Node } = {}
    private types: { [type: string]: NodeType } = {}
    private edges: { [id: string]: NodeEdges } = {}

    constructor(viewSize: { width: number; height: number }, viewPadding: { right: number; bottom: number }) {
        this.view.size = viewSize
        this.view.padding = viewPadding
    }

    getIndex() {
        return this.index
    }

    setIndex(index: number) {
        return (this.index = Math.min(Math.max(index, 0), this.size))
    }

    getSize() {
        return this.size
    }

    setSize(programSize: number) {
        return (this.size = Math.max(programSize, 0))
    }

    getAnimate() {
        return this.animate
    }

    setAnimate(animate: boolean) {
        return (this.animate = animate)
    }

    subscribe(id: string, callback: () => void) {
        const subscriptions = this.subscriptions[id] ?? (this.subscriptions[id] = [])
        subscriptions.push(callback)
    }

    callSubscriptions(id: string) {
        this.subscriptions[id]?.forEach(subscription => subscription())
    }

    clearSubscriptions() {
        this.subscriptions = {}
    }

    getNode(id: string, partial: Partial<Node> = {}) {
        return this.nodes[id] ?? (this.nodes[id] = { ...createBaseNode(id), ...partial, id })
    }

    getNodeType(type: string, partial: Partial<NodeType> = {}) {
        return this.types[type] ?? (this.types[type] = { ...createBaseNodeType(), ...partial })
    }

    clearNodes() {
        this.nodes = {}
        this.types = {}
    }

    clearNodeRenders() {
        Object.values(this.nodes).forEach(node => (node.render = true))
    }

    getEdges(id: string) {
        return this.edges[id] ?? (this.edges[id] = createBaseNodeEdges())
    }

    pushEdge(id: string, name: string, partial: Partial<Edge> = {}) {
        const edge: Edge = { ...createBaseEdge(id, name), ...partial, id, name }
        if (!edge.self || edge.target == undefined) return this.getEdges(id).loose.push(edge)
        this.getEdges(id).children.push(edge)
        this.getEdges(edge.target).parents.push(edge)
    }

    clearEdges() {
        this.edges = {}
    }

    // Helper methods (properties changed by all following methods must not be changed directly)

    getNodePosition(node: Node, index: number = this.index) {
        return node.positions[index] ?? this.setNodePositions(node, { x: 0, y: 0 })
    }

    setNodePositions(
        node: Node,
        position: { x: number; y: number },
        index = this.index,
        mode: 'all' | 'index' | 'override' | 'available' = 'available'
    ) {
        const paddedPosition = this.view.padPoint(position)
        switch (mode) {
            case 'all':
                for (let i = 0; i < this.getSize(); i++) node.positions[i] = paddedPosition
                break
            case 'index':
                node.positions[index] = paddedPosition
                break
            case 'override':
                for (let i = index; i < this.getSize(); i++) node.positions[i] = paddedPosition
                break
            case 'available':
                const basePosition = node.positions[index]
                for (
                    let i = index;
                    i < this.getSize() && (!node.positions[i] || node.positions[i] === basePosition);
                    i++
                )
                    node.positions[i] = paddedPosition
                break
        }
        return paddedPosition
    }

    getNodeShape(node: Node) {
        return node.mode === 'own' ? node.shape : this.getNodeType(node.type).shape
    }

    setNodeShape(node: Node, shape: string) {
        return node.mode === 'own' ? (node.shape = shape) : (this.getNodeType(node.type).shape = shape)
    }

    getNodeParameters(node: Node) {
        if (node.mode === 'own') return node.parameters[node.shape]
        const nodeType = this.getNodeType(node.type)
        return nodeType.parameters[nodeType.shape]
    }

    setNodeParameters(node: Node, parameters: UnknownParameters) {
        if (node.mode === 'own') return (node.parameters[node.shape] = parameters)
        const nodeType = this.getNodeType(node.type)
        return (nodeType.parameters[nodeType.shape] = parameters)
    }

    getNodeRecursiveChildren(node: Node, depth = 0, skipBase = false, pool: { [id: string]: Node } = {}) {
        if (depth < 0 || pool[node.id]) return pool
        if (!skipBase) pool[node.id] = node
        this.getEdges(node.id).children.forEach(edge =>
            this.getNodeRecursiveChildren(this.getNode(edge.target), depth - 1, false, pool)
        )
        return pool
    }

    moveNodePositions(
        node: Node,
        depth = 0,
        delta: { x: number; y: number },
        index = this.index,
        mode: 'all' | 'index' | 'override' | 'available' = 'available'
    ) {
        const children = this.getNodeRecursiveChildren(node, depth)
        Object.values(children).forEach(child => {
            const position = this.getNodePosition(child, index)
            this.setNodePositions(child, { x: position.x + delta.x, y: position.y + delta.y }, index, mode)
        })
        return children
    }

    findStructureBaseNode(node: Node): Node {
        const highestParent = this.getEdges(node.id)
            .parents.map(edge => this.getNode(edge.id))
            .reduce((acc, parent) => (parent.type === acc.type && parent.depth < acc.depth ? parent : acc), node)
        return highestParent === node ? node : this.findStructureBaseNode(highestParent)
    }

    findStructure(node: Node, parent: Node = undefined, depth = 0, structure = createBaseStructure()): Structure {
        if (!structure.base) {
            structure.base = this.findStructureBaseNode(node)
            return this.findStructure(structure.base, undefined, 0, structure)
        }
        const isMember = !!structure.members[node.id]
        if (!isMember) {
            structure.members[node.id] = node
            structure.links[node.id] = { children: [], parents: [] }
            structure.size++
            structure.depth = Math.max(structure.depth, depth)
            this.getEdges(node.id)
                .children.map(edge => this.getNode(edge.target))
                .forEach(child => {
                    if (child.type !== structure.base.type) return
                    this.findStructure(child, node, depth + 1, structure)
                    const isSameAsParent = node.id === parent?.id
                    const childIsSameAsParent = child.id === parent?.id
                    structure.hasCycleEdge = structure.hasCycleEdge || isSameAsParent
                    structure.hasParentEdge = structure.hasParentEdge || (!isSameAsParent && childIsSameAsParent)
                    structure.hasCrossEdge = structure.hasCrossEdge || (!isSameAsParent && !childIsSameAsParent)
                })
        }
        if (parent && node.id !== parent.id) {
            structure.links[parent.id].children.push(node)
            structure.links[node.id].parents.push(parent)
        }
        return structure
    }

    computeStructureLayout(
        structure: Structure,
        horizontal: boolean,
        increment: { x: number; y: number },
        normalize: boolean = true,
        node = structure.base,
        depth = { x: 0, y: 0 },
        positions: { [id: string]: { x: number; y: number } } = {}
    ): [{ [id: string]: { x: number; y: number } }, { x: number; y: number }] {
        if (positions[node.id]) return [positions, depth]
        positions[node.id] = { x: 0, y: 0 }
        const childrenEndDepth = structure.links[node.id].children.reduce(
            (acc, child) => {
                if (positions[child.id]) return acc
                const childDepth = { x: acc.x + Number(horizontal), y: acc.y + Number(!horizontal) }
                const [, childEndDepth] = this.computeStructureLayout(
                    structure,
                    horizontal,
                    increment,
                    normalize,
                    child,
                    childDepth,
                    positions
                )
                return childEndDepth
            },
            { ...depth }
        )
        const isLeaf = horizontal ? depth.y === childrenEndDepth.y : depth.x === childrenEndDepth.x
        positions[node.id].x = increment.x * (horizontal || isLeaf ? depth.x : (depth.x + childrenEndDepth.x - 1) / 2)
        positions[node.id].y = increment.y * (!horizontal || isLeaf ? depth.y : (depth.y + childrenEndDepth.y - 1) / 2)
        const endDepth = {
            x: childrenEndDepth.x + (horizontal ? -1 : isLeaf ? 1 : 0),
            y: childrenEndDepth.y + (!horizontal ? -1 : isLeaf ? 1 : 0)
        }
        if (normalize && node === structure.base) {
            const origin = { x: positions[structure.base.id].x, y: positions[structure.base.id].y }
            Object.values(positions).forEach(position => ((position.x -= origin.x), (position.y -= origin.y)))
        }
        return [positions, endDepth]
    }

    applyStructureLayout(
        node: Node,
        position: { x: number; y: number } = undefined,
        direction = 'horizontal' as 'horizontal' | 'vertical',
        incrementRatio = { x: 1.5, y: 1.5 },
        normalize = true,
        index = this.index,
        mode: 'all' | 'index' | 'override' | 'available' = 'available'
    ) {
        const structure = this.findStructure(node)
        console.log('structure', structure)
        const sizeAnchor = node.size
        const increment = { x: sizeAnchor.x * incrementRatio.x, y: sizeAnchor.y * incrementRatio.y }
        const [positions] = this.computeStructureLayout(structure, direction === 'horizontal', increment, normalize)
        const anchor = position ?? this.getNodePosition(node, index)
        Object.entries(positions).forEach(([id, delta]) =>
            this.setNodePositions(this.getNode(id), { x: anchor.x + delta.x, y: anchor.y + delta.y }, index, mode)
        )
        return structure
    }

    computeEdgeStartPoint(edge: Edge) {
        const delta = (edge.from as any).delta as { x: number; y: number }
        const targetDelta = (edge.from as any).targetDelta as { x: number; y: number }
        const point = (edge.from as any).point as { x: number; y: number }
        if (delta) {
            const sourceNode = this.getNode(edge.id)
            const sourcePosition = this.getNodePosition(sourceNode)
            return { x: sourcePosition.x + delta.x, y: sourcePosition.y + delta.y }
        } else if (targetDelta) {
            if (edge.target != undefined) {
                const targetNode = this.getNode(edge.target)
                const targetPosition = this.getNodePosition(targetNode)
                return { x: targetPosition.x + targetDelta.x, y: targetPosition.y + targetDelta.y }
            } else {
                const targetPoint = (edge.to as any).point as { x: number; y: number }
                return { x: targetPoint.x + delta.x, y: targetPoint.y + delta.y }
            }
        }
        return point
    }

    computeEdgeEndPoint(edge: Edge, startPoint = this.computeEdgeStartPoint(edge)) {
        const mode = (edge.to as any).mode as string
        const delta = (edge.to as any).delta as { x: number; y: number }
        const point = (edge.to as any).point as { x: number; y: number }
        if (edge.target != undefined) {
            const targetNode = this.getNode(edge.target)
            const targetPosition = this.getNodePosition(targetNode)
            const targetSize = targetNode.size
            if (mode != undefined) {
                switch (mode) {
                    case 'position':
                        return { x: targetPosition.x, y: targetPosition.y }
                    case 'near': // TODO implement other cases
                    default:
                        return {
                            x: Math.min(Math.max(startPoint.x, targetPosition.x), targetPosition.x + targetSize.x),
                            y: Math.min(Math.max(startPoint.y, targetPosition.y), targetPosition.y + targetSize.y)
                        }
                }
            }
            return { x: targetPosition.x + delta.x, y: targetPosition.y + delta.y }
        }
        return point
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
