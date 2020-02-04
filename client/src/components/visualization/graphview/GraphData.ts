export type DefaultParameters = {
    [name: string]:
        | { value: boolean }
        | { value: number; range: [number, number] }
        | { value: string; options: string[] }
}

export type UnknownParameters = { [name: string]: DefaultParameters[keyof DefaultParameters]['value'] }

export type ComputedParameters<T extends DefaultParameters> = { [name in keyof T]: T[name]['value'] }

export type Node = {
    id: string
    render: boolean
    positions: { x: number; y: number }[]
    sizes: { width: number; height: number }[]
    mode: 'id' | 'type'
    shape: { id: string; type: string }
    parameters: { id: UnknownParameters; type: UnknownParameters }
}

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

export type Edge = {
    id: string
    render: boolean
    from:
        | {
              nodeId: string
              mode: 'position' | 'size' | 'center' | 'third' | 'quarter' | 'corner' | 'nearest'
          }
        | {
              delta: { x: number; y: number }
          }
        | { distance: number }
        | { x: number; y: number }
    to:
        | {
              nodeId: string
              mode: 'position' | 'size' | 'center' | 'third' | 'quarter' | 'corner' | 'nearest'
          }
        | { x: number; y: number }
    text: string
}

export class GraphData {
    private index: number = 0
    private animate: boolean = true
    private viewBox: { x: number; y: number; width: number; height: number } = { x: 0, y: 0, width: 0, height: 0 }
    private subscriptionCalls = 0
    private subscriptions: { [id: string]: ((subscriptionIndex: number) => void)[] } = {}
    private nodes: { [id: string]: Node } = {}
    private edges: { [id: string]: Edge } = {}

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
        Object.values(this.subscriptions)
            .flat()
            .forEach(subscription => subscription(callId))
    }

    clearSubscriptions() {
        this.subscriptions = {}
    }

    private getNode(id: string, partialNode: Partial<Node> = {}) {
        return (
            this.nodes[id] ??
            (this.nodes[id] = {
                id,
                render: partialNode.render ?? true,
                positions: partialNode.positions ?? [],
                sizes: partialNode.sizes ?? (partialNode.sizes = []),
                mode: partialNode.mode ?? 'id',
                shape: partialNode.shape ?? { id: '', type: '' },
                parameters: partialNode.parameters ?? { id: {}, type: {} }
            })
        )
    }

    private getEdge(id: string, partialEdge: Partial<Edge> = {}) {
        return (
            this.edges[id] ??
            (this.edges[id] = {
                id,
                render: partialEdge.render ?? true,
                from: partialEdge.from ?? { x: 0, y: 0 },
                to: partialEdge.to ?? { x: 0, y: 0 },
                text: ''
            })
        )
    }

    hasNode(id: string) {
        return !!this.nodes[id]
    }

    hasEdge(id: string) {
        return !!this.edges[id]
    }

    clearNodes() {
        this.nodes = {}
    }

    clearEdges() {
        this.edges = {}
    }

    getNodeRender(id: string) {
        return this.getNode(id).render ?? this.setNodeRender(id, true)
    }

    setNodeRender(id: string, render: boolean) {
        return (this.getNode(id).render = render)
    }

    getNodePosition(id: string, index: number) {
        return this.getNode(id).positions[index] ?? this.setNodePositions(id, [index, index], { x: 0, y: 0 })
    }

    setNodePositions(id: string, range: [number, number], position: { x: number; y: number }) {
        const positions = this.getNode(id).positions
        const paddedPosition = {
            x: Math.min(Math.max(position.x, 0), this.viewSize.width - this.viewPadding.x),
            y: Math.min(Math.max(position.y, 0), this.viewSize.height - this.viewPadding.y)
        }
        for (let i = range[0]; i <= range[1]; i++) positions[i] = paddedPosition
        return paddedPosition
    }

    getNodeSize(id: string, index: number) {
        return this.getNode(id).sizes[index] ?? this.setNodeSizes(id, [index, index], { width: 0, height: 0 })
    }

    setNodeSizes(id: string, range: [number, number], size: { width: number; height: number }) {
        const sizes = this.getNode(id).sizes
        for (let i = range[0]; i <= range[1]; i++) sizes[i] = size
        return size
    }

    getNodeMode(id: string) {
        return this.getNode(id).mode
    }

    setNodeMode(id: string, mode: 'id' | 'type') {
        return (this.getNode(id).mode = mode)
    }

    getNodeShape(id: string) {
        const node = this.getNode(id)
        return node.shape[node.mode]
    }

    setNodeShape(id: string, shape: string) {
        const node = this.getNode(id)
        return (node.shape[node.mode] = shape)
    }

    getNodeParameters(id: string) {
        const node = this.getNode(id)
        return node.parameters[node.mode]
    }

    setNodeParameters(id: string, parameters: UnknownParameters) {
        const node = this.getNode(id)
        return (node.parameters[node.mode] = parameters)
    }

    getEdgeRender(id: string) {
        return this.getNode(id).render
    }

    setEdgeRender(id: string, render: boolean) {
        return (this.getNode(id).render = render)
    }

    getEdgeFrom(id: string) {
        return this.getEdge(id).from
    }

    setEdgeFrom(id: string, from: Edge['from']) {
        return (this.getEdge(id).from = from)
    }

    getEdgeTo(id: string) {
        return this.getEdge(id).to
    }

    setEdgeTo(id: string, to: Edge['to']) {
        return (this.getEdge(id).to = to)
    }

    getEdgeText(id: string) {
        return this.getEdge(id).text
    }

    setEdgeText(id: string, text: string) {
        return (this.getEdge(id).text = text)
    }
}
