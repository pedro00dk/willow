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

// GraphData computes all manipulations in the Graph visualization

class View {
    size = { width: Infinity, height: Infinity }
    padding = { left: 0, top: 0, right: 0, bottom: 0 }
    box = { x: 0, y: 0, width: 0, height: 0 }

    center() {
        return { x: this.size.width, y: this.size.height }
    }

    boxCenter() {
        return { x: this.box.x + this.box.width / 2, y: this.box.y + this.box.height / 2 }
    }

    pad(position: { x: number; y: number }) {
        return {
            x: Math.min(Math.max(position.x, this.padding.left), this.size.width - this.padding.right),
            y: Math.min(Math.max(position.y, this.padding.top), this.size.height - this.padding.bottom)
        }
    }
}

class Subscriptions {
    private subscriptions: { [id: string]: (() => void)[] } = {}

    subscribe(id: string, callback: () => void) {
        const subscriptions = this.subscriptions[id] ?? (this.subscriptions[id] = [])
        subscriptions.push(callback)
    }

    call(id: string) {
        this.subscriptions[id]?.forEach(subscription => subscription())
    }

    clear() {
        this.subscriptions = {}
    }
}

export class Node {
    readonly graph: Graph
    readonly id: string
    type = ''
    depth = 0
    render = true
    positions = [] as { x: number; y: number }[]
    size = { width: 0, height: 0 }
    mode = 'type' as 'self' | 'type'
    shapes = new Shapes()
    layout: {
        position: { x: number; y: number }
        parameters: ComputedParameters<typeof layoutParameters>
    } = {
        position: undefined,
        parameters: readParameters(undefined, layoutParameters)
    }

    constructor(graph: Graph, id: string, partial?: Partial<Node>) {
        Object.assign(this, partial)
        this.graph = graph
        this.id = id
    }

    getPosition(index: number = this.graph.index) {
        return this.positions[index] ?? this.setPosition({ x: 0, y: 0 })
    }

    setPosition(position: { x: number; y: number }, mode: 'all' | 'ovr' | 'avl' = 'avl', index = this.graph.index) {
        const steps = this.graph.steps
        position = this.graph.view.pad(position)
        switch (mode) {
            case 'all':
                for (let i = 0; i < steps; i++) this.positions[i] = position
                break
            case 'ovr':
                for (let i = index; i < steps; i++) this.positions[i] = position
                break
            case 'avl':
                const base = this.positions[index]
                for (let i = index; i < steps && (!this.positions[i] || this.positions[i] === base); i++)
                    this.positions[i] = position
                break
        }
        return position
    }

    centralize(random: 0, mode: 'all' | 'ovr' | 'avl' = 'avl', index = this.graph.index) {
        const position = this.graph.view.boxCenter()
        position.x += (Math.random() - 0.5) * 2 * random - this.size.width / 2
        position.y += (Math.random() - 0.5) * 2 * random - this.size.height / 2
        return this.setPosition(position, mode, index)
    }

    move(delta: { x: number; y: number }, depth = 0, mode: 'all' | 'ovr' | 'avl' = 'avl', index = this.graph.index) {
        return this.getChildren(depth, true, (children: Node) => {
            const position = children.getPosition(index)
            children.setPosition({ x: position.x + delta.x, y: position.y + delta.y }, mode, index)
            return true
        })
    }

    getShape() {
        if (this.mode === 'self') return this.shape
        const typeData = this.graph.types[this.type] ?? (this.graph.types[this.type] = { shape: '', parameters: {} })
        return typeData.shape
    }

    setShape(shape: string) {
        if (this.mode === 'self') return (this.shape = shape)
        const typeData = this.graph.types[this.type] ?? (this.graph.types[this.type] = { shape: '', parameters: {} })
        return (typeData.shape = shape)
    }

    getParameters() {
        if (this.mode === 'self') return this.parameters[this.shape] ?? {}
        const typeData = this.graph.types[this.type] ?? (this.graph.types[this.type] = { shape: '', parameters: {} })
        return typeData.parameters[this.shape]
    }

    setParameters(parameters: UnknownParameters) {
        if (this.mode === 'self') return (this.parameters[this.shape] = parameters)
        const typeData = this.graph.types[this.type] ?? (this.graph.types[this.type] = { shape: '', parameters: {} })
        return (typeData.parameters[typeData.shape] = parameters)
    }

    getParents(depth = 0, includeBase = true, filter = (parent: Node) => true, pool: { [id: string]: Node } = {}) {
        if (depth < 0 || pool[this.id] || !filter(this)) return pool
        if (includeBase) pool[this.id] = this
        this.graph
            .getEdges(this.id)
            .parents.forEach(edge => this.graph.getNode(edge.id).getParents(depth - 1, true, filter, pool))
        return pool
    }

    getChildren(depth = 0, includeBase = true, filter = (child: Node) => true, pool: { [id: string]: Node } = {}) {
        if (depth < 0 || pool[this.id] || !filter(this)) return pool
        if (includeBase) pool[this.id] = this
        this.graph
            .getEdges(this.id)
            .children.forEach(edge => this.graph.getNode(edge.target).getChildren(depth - 1, true, filter, pool))
        return pool
    }
}

export class Edge {
    readonly graph: Graph
    readonly id: string
    readonly name: string
    self = true
    target: string = undefined
    from = { delta: { x: 0, y: 0 }, source: 'origin' as 'origin' | 'self' | 'target' }
    to = { delta: { x: 0, y: 0 }, source: 'origin' as 'origin' | 'self' | 'target' | 'target-near' }
    draw = 'curve' as 'line' | 'curve'
    width = 1
    color = 'black'
    text = ''

    constructor(graph: Graph, id: string, name: string, partial?: Partial<Edge>) {
        Object.assign(this, partial)
        this.graph = graph
        this.id = id
        this.name = name
    }

    private computeFrom() {
        const { delta, source } = this.from
        const selfPosition = this.graph.getNode(this.id).getPosition()
        const targetPosition = this.target && this.graph.getNode(this.target).getPosition()
        if (source === 'origin') return delta
        else if (source === 'self') return { x: selfPosition.x + delta.x, y: selfPosition.y + delta.y }
        else return { x: targetPosition.x + delta.x, y: targetPosition.y + delta.y }
    }

    private computeTo(from = this.computeFrom()) {
        const { delta, source } = this.from
        const selfPosition = this.graph.getNode(this.id).getPosition()
        const targetPosition = this.target && this.graph.getNode(this.target).getPosition()
        const targetSize = this.target && this.graph.getNode(this.target).size
        if (source === 'origin') return delta
        else if (source === 'self') return { x: selfPosition.x + delta.x, y: selfPosition.y + delta.y }
        else if (source === 'target') return { x: targetPosition.x + delta.x, y: targetPosition.y + delta.y }
        else
            return {
                x: Math.min(Math.max(from.x, targetPosition.x), targetPosition.x + targetSize.width),
                y: Math.min(Math.max(from.y, targetPosition.y), targetPosition.y + targetSize.height)
            }
    }

    private computeCurvature(ratio: number, from = this.computeFrom(), endPoint = this.computeTo(from)) {
        const center = { x: lerp(from.x, endPoint.x, 0.5), y: lerp(from.y, endPoint.y, 0.5) }
        if (this.draw === 'line') return center
        const parallelVector = { x: endPoint.x - from.x, y: endPoint.y - from.y }
        const orthogonalVector = { x: parallelVector.y * ratio, y: -parallelVector.x * ratio }
        const curvature = { x: center.x + orthogonalVector.x, y: center.y + orthogonalVector.y }
        return curvature
    }

    computePath() {
        const from = this.computeFrom()
        const to = this.computeTo(from)
        const curvature = this.computeCurvature(0.1, from, to)
        return `M ${from.x},${from.y} Q ${curvature.x},${curvature.y} ${to.x},${to.y}`
    }
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

export class Shapes {
    private shape = ''
    private parameters = { [this.shape]: {} } as { [shape: string]: UnknownParameters }

    get<T extends ShapeParameters>(defaultParameters: T) {
        return [this.shape, this.resolveParameters(defaultParameters)]
    }

    setShape(shape: string) {
        this.shape = shape
        if (!this.parameters[shape]) this.parameters = {}
    }

    setParameters(parameters: UnknownParameters) {
        this.parameters[this.shape] = parameters
    }

    private resolveParameters<T extends ShapeParameters>(defaultParameters: T) {
        const parameters = this.parameters[this.shape]
        return Object.fromEntries(
            Object.entries(defaultParameters).map(([name, def]) => [name, parameters ? parameters[name] : def.value])
        ) as ComputedParameters<T>
    }
}

// Helper objects and functions for Parameters and Layout components of Node

export const layoutParameters = {
    automatic: { value: false, bool: true as const },
    direction: { value: 'horizontal', options: ['horizontal', 'vertical'] },
    member: { value: undefined as string, members: 'all' as const }
}

export class Structure {
    readonly graph: Graph
    base: Node
    members = {} as { [id: string]: Node }
    links = {} as { [id: string]: { children: Node[]; parents: Node[] } }
    size = 0
    depth = 0
    cycleEdges = 0
    parentEdges = 0
    crossEdges = 0
    info = {
        type: 'linear' as 'linear' | 'tree' | 'fuzzy',
        parenting: false,
        children: 0
    }

    constructor(graph: Graph, node: Node) {
        this.graph = graph
        this.findBase(node)
        this.expand()
        this.analyze()
    }

    private findBase(node: Node) {
        const parents = node.getParents(Infinity, true, (parent: Node) => parent.type === node.type)
        this.base = Object.values(parents).reduce((acc, parent) => (parent.depth > acc.depth ? parent : acc), node)
    }

    private expand(node = this.base, ancestors = [] as Node[], depth = 0) {
        const newMember = !this.members[node.id]
        const parent = ancestors[ancestors.length - 1]
        const grandParent = ancestors[ancestors.length - 2]
        if (parent) {
            this.links[parent.id].children.push(node)
            this.links[node.id].parents.push(parent)
        }
        if (node.id === parent?.id) this.cycleEdges++
        else if (node.id === grandParent?.id) this.parentEdges++
        else if (!newMember) this.crossEdges++
        if (!newMember) return
        this.members[node.id] = node
        this.links[node.id] = { children: [], parents: [] }
        this.size++
        this.depth = Math.max(this.depth, depth)
        ancestors.push(node)
        this.graph
            .getEdges(node.id)
            .children.map(edge => this.graph.getNode(edge.target))
            .forEach(child => child.type !== this.base.type && this.expand(child, ancestors, depth + 1))
        ancestors.pop()
    }

    private analyze() {
        this.info.type = this.crossEdges > 0 ? 'fuzzy' : this.depth < this.size ? 'tree' : 'linear'
        this.info.parenting = this.parentEdges > 0
        const children = Object.values(this.links).reduce((acc, links) => Math.max(acc, links.children.length), 0)
        this.info.children = Math.max(children - Number(this.info.parenting), 0)
    }

    private computeLayout(
        node = this.base,
        delta = { breadth: 0, depth: 0 },
        layout = {} as { [id: string]: typeof delta }
    ) {
        if (layout[node.id]) return [layout, delta] as const
        layout[node.id] = { breadth: 0, depth: 0 }
        const beforeChildrenDelta = delta
        const afterChildrenDelta: typeof delta = this.links[node.id].children.reduce(
            (acc, child) => {
                const isSelf = child.id === node.id
                const isParent = !isSelf && !!layout[child.id]
                if (isSelf || isParent) return acc
                const beforeChildDelta = acc
                beforeChildDelta.depth++
                const [, afterChildDelta] = this.computeLayout(child, beforeChildDelta, layout)
                afterChildDelta.depth--
                return afterChildDelta
            },
            { ...beforeChildrenDelta }
        )
        const isLeaf = beforeChildrenDelta.breadth === afterChildrenDelta.breadth
        if (isLeaf) afterChildrenDelta.breadth++
        layout[node.id].breadth = (beforeChildrenDelta.breadth + afterChildrenDelta.breadth - 1) / 2
        layout[node.id].depth = beforeChildrenDelta.depth
        return [layout, afterChildrenDelta] as const
    }

    private transformLayout(
        layout: { [id: string]: { breadth: number; depth: number } },
        scale = { breadth: 1, depth: 1 },
        translate = { breadth: 0, depth: 0 }
    ) {
        Object.values(layout).forEach(delta => {
            delta.breadth = delta.breadth * scale.breadth + translate.breadth
            delta.depth = delta.depth * scale.depth + translate.depth
        })
    }

    private resolveLayout(
        layout: { [id: string]: { breadth: number; depth: number; [resolved: string]: number } },
        breadth: string,
        depth: string
    ) {
        Object.values(layout).forEach(delta => {
            delta[breadth] = delta.breadth
            delta[depth] = delta.depth
        })
    }

    applyLayout(
        increment = { breadth: 1.5, depth: 1.5 },
        horizontal = true,
        position = this.base.getPosition(),
        mode: 'all' | 'ovr' | 'avl' = 'avl',
        index = this.graph.index
    ) {
        const [layout] = this.computeLayout()
        const baseDelta = layout[this.base.id]
        const scale = {
            breadth: (horizontal ? this.base.size.height : this.base.size.width) * increment.breadth,
            depth: (horizontal ? this.base.size.width : this.base.size.height) * increment.depth
        }
        const translate = {
            breadth: horizontal ? position.y : position.x,
            depth: horizontal ? position.x : position.y
        }
        this.transformLayout(layout, undefined, { breadth: -baseDelta.breadth, depth: -baseDelta.depth })
        this.transformLayout(layout, scale, translate)
        this.resolveLayout(layout, horizontal ? 'y' : 'x', horizontal ? 'x' : 'y')
        Object.entries(layout).forEach(([id, position]) => this.members[id].setPosition(position as any, mode, index))
        return layout
    }
}

export class Graph {
    index: number = 0
    steps: number = 0
    animate: boolean = true
    view: View = new View()
    subscriptions = new Subscriptions()
    nodes: { [id: string]: Node } = {}
    types: { [type: string]: { shape: string; parameters: { [shape: string]: UnknownParameters } } } = {}
    edges: { [id: string]: { children: Edge[]; parents: Edge[]; loose: Edge[] } } = {}

    constructor(size: View['size'], padding: View['padding']) {
        this.view.size = size
        this.view.padding = padding
    }

    getNode(id: string, partial: Partial<Node> = {}) {
        return this.nodes[id] ?? (this.nodes[id] = new Node(this, id, partial))
    }

    clearNodes() {
        this.nodes = {}
        this.types = {}
    }

    clearNodeRenders() {
        Object.values(this.nodes).forEach(node => (node.render = true))
    }

    getEdges(id: string) {
        return this.edges[id] ?? (this.edges[id] = { children: [], parents: [], loose: [] })
    }

    pushEdge(id: string, name: string, partial: Partial<Edge> = {}) {
        const edge = new Edge(this, id, name, partial)
        if (!edge.self || !edge.target) return this.getEdges(id).loose.push(edge)
        this.getEdges(id).children.push(edge)
        this.getEdges(edge.target).parents.push(edge)
    }

    clearEdges() {
        this.edges = {}
    }
}
