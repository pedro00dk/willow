export type DefaultParameters = {
    [name: string]:
        | { value: boolean }
        | { value: number; range: [number, number] }
        | { value: string; options: string[] }
}

export type UnknownParameters = { [name: string]: DefaultParameters[keyof DefaultParameters]['value'] }

export type ComputedParameters<T extends DefaultParameters> = { [name in keyof T]: T[name]['value'] }

export class GraphData {
    private index: number = 0
    private animate: boolean = true
    private positions: { [id: string]: { x: number; y: number }[] } = {}
    private sizes: { [id: string]: { x: number; y: number }[] } = {}
    private targets: { [id: string]: { target: string; delta: { x: number; y: number }; text: string }[] } = {}
    private selector: { [id: string]: 'id' | 'type' } = {}
    private nodeName: { [id: string]: string } = {}
    private parameters: { [id: string]: UnknownParameters } = {}
    private typeNodeName: { [type: string]: string } = {}
    private typeParameters: { [type: string]: UnknownParameters } = {}
    private subscriptionCalls = 0
    private subscriptions: { [id: string]: ((subscriptionIndex: number) => void)[] } = {}

    constructor(private graphSize: { x: number; y: number }, private padding: { x: number; y: number }) {}

    getGraphSize() {
        return this.graphSize
    }

    getPadding() {
        return this.padding
    }

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

    getPosition(id: string, index: number, def = { x: 0, y: 0 }) {
        return this.positions[id]?.[index] ?? this.setPositionRange(id, [index, index], def)
    }

    setPositionRange(id: string, range: [number, number], position: { x: number; y: number }) {
        const positions = this.positions[id] ?? (this.positions[id] = [])
        const paddedPosition = {
            x: Math.min(Math.max(position.x, 0), this.graphSize.x - this.padding.x),
            y: Math.min(Math.max(position.y, 0), this.graphSize.y - this.padding.y)
        }
        for (let i = range[0]; i <= range[1]; i++) positions[i] = paddedPosition
        return paddedPosition
    }

    getSize(id: string, index: number, def = { x: 0, y: 0 }) {
        return this.sizes[id]?.[index] ?? this.setSizeRange(id, [index, index], def)
    }

    setSizeRange(id: string, range: [number, number], size: { x: number; y: number }) {
        const sizes = this.sizes[id] ?? (this.sizes[id] = [])
        for (let i = range[0]; i <= range[1]; i++) sizes[i] = size
        return size
    }

    getTargets(id: string, def: { target: string; delta: { x: number; y: number }; text: string }[] = []) {
        return this.targets[id] ?? this.setTargets(id, def)
    }

    setTargets(id: string, targets: { target: string; delta: { x: number; y: number }; text: string }[]) {
        return (this.targets[id] = targets)
    }

    clearTargets() {
        this.targets = {}
    }

    getSelector(id: string, def: 'id' | 'type' = 'type') {
        return this.selector[id] ?? this.setSelector(id, def)
    }

    setSelector(id: string, selector: 'id' | 'type') {
        return (this.selector[id] = selector)
    }

    getNodeName(id: string, def?: string) {
        return this.nodeName[id] ?? this.setNodeName(id, def)
    }

    setNodeName(id: string, nodeType: string) {
        return (this.nodeName[id] = nodeType)
    }

    getParameters(id: string, def: UnknownParameters = {}) {
        return this.parameters[id] ?? this.setParameters(id, def)
    }

    setParameters(id: string, parameters: UnknownParameters) {
        return (this.parameters[id] = parameters)
    }

    getTypeNodeName(type: string, def?: string) {
        return this.typeNodeName[type] ?? this.setTypeNodeName(type, def)
    }

    setTypeNodeName(type: string, nodeType: string) {
        return (this.typeNodeName[type] = nodeType)
    }

    getTypeParameters(type: string, def: UnknownParameters = {}) {
        return this.typeParameters[type] ?? this.setTypeParameters(type, def)
    }

    setTypeParameters(type: string, parameters: UnknownParameters) {
        return (this.typeParameters[type] = parameters)
    }

    subscribe(id: string, callback: (subscriptionCall: number) => void) {
        const subscriptions = this.subscriptions[id] ?? (this.subscriptions[id] = [])
        subscriptions.push(callback)
    }

    callSubscriptions(id?: string) {
        const subscriptionCall = this.subscriptionCalls++
        if (id != undefined) return this.subscriptions[id]?.forEach(subscription => subscription(subscriptionCall))
        Object.values(this.subscriptions)
            .flat()
            .forEach(subscription => subscription(subscriptionCall))
    }

    clearSubscriptions() {
        this.subscriptions = {}
    }
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
