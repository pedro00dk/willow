export type DefaultParameters = {
    [name: string]:
        | { value: boolean }
        | { value: number; range: [number, number] }
        | { value: string; options: string[] }
}

export type UnknownParameters = { [name: string]: DefaultParameters[keyof DefaultParameters]['value'] }

export type ComputedParameters<T extends DefaultParameters> = { [name in keyof T]: T[name]['value'] }

export class GraphController {
    private subscriptionCalls = 0
    private subscriptions: { [id: string]: ((subscriptionIndex: number) => void)[] } = {}
    private index: number
    private positions: { [id: string]: { x: number; y: number }[] } = {}
    private sizes: { [id: string]: { x: number; y: number }[] } = {}
    private targets: { [id: string]: { target: string; delta: { x: number; y: number } }[] } = {}
    private selector: { [id: string]: 'id' | 'type' } = {}
    private nodeName: { [id: string]: string } = {}
    private parameters: { [id: string]: UnknownParameters } = {}
    private typeNodeName: { [type: string]: string } = {}
    private typeParameters: { [type: string]: UnknownParameters } = {}

    constructor(private graphSize: { x: number; y: number }, private endPadding: { x: number; y: number }) {}

    getGraphSize() {
        return this.graphSize
    }

    getPadding() {
        return this.endPadding
    }

    subscribe(id: string, callback: (subscriptionCall: number) => void) {
        ;(this.subscriptions[id] || (this.subscriptions[id] = [])).push(callback)
    }

    callSubscriptions(id?: string) {
        const subscriptionCall = this.subscriptionCalls++
        if (!id)
            return Object.values(this.subscriptions)
                .flat()
                .forEach(subscription => subscription(subscriptionCall))

        const subscriptions = this.subscriptions[id]
        if (subscriptions) subscriptions.forEach(subscription => subscription(subscriptionCall))
    }

    clearSubscriptions() {
        this.subscriptions = {}
    }

    getIndex() {
        return this.index
    }

    setIndex(index: number) {
        this.index = index
    }

    getPosition(id: string, index: number, def = { x: 0, y: 0 }) {
        const positions = this.positions[id] || (this.positions[id] = [])
        return positions[index] || this.setPositionRange(id, [index, index], def)
    }

    setPositionRange(id: string, range: [number, number], position: { x: number; y: number }) {
        const positions = this.positions[id] || (this.positions[id] = [])
        const paddedPosition = {
            x: Math.min(Math.max(position.x, 0), this.graphSize.x - this.endPadding.x),
            y: Math.min(Math.max(position.y, 0), this.graphSize.y - this.endPadding.y)
        }
        for (let i = range[0]; i <= range[1]; i++) positions[i] = paddedPosition
        return paddedPosition
    }

    getSize(id: string, index: number, def = { x: 0, y: 0 }) {
        const sizes = this.sizes[id] || (this.sizes[id] = [])
        return sizes[index] ? sizes[index] : this.setSizeRange(id, [index, index], def)
    }

    setSizeRange(id: string, range: [number, number], size: { x: number; y: number }) {
        const sizes = this.sizes[id] || (this.sizes[id] = [])
        for (let i = range[0]; i <= range[1]; i++) sizes[i] = size
        return size
    }

    getTargets(id: string) {
        return this.targets[id] || (this.targets[id] = [])
    }

    setTargets(id: string, targets: { target: string; delta: { x: number; y: number } }[]) {
        this.targets[id] = targets
    }

    clearTargets() {
        this.targets = {}
    }

    getSelector(id: string, def: 'id' | 'type' = 'type') {
        return this.selector[id] || this.setSelector(id, def)
    }

    setSelector(id: string, selector: 'id' | 'type') {
        return (this.selector[id] = selector)
    }

    getNodeName(id: string, def?: string) {
        return this.nodeName[id] || this.setNodeName(id, def)
    }

    setNodeName(id: string, nodeType: string) {
        return (this.nodeName[id] = nodeType)
    }

    getParameters(id: string, def: UnknownParameters = {}) {
        console.log(this.parameters[id])
        return this.parameters[id] || this.setParameters(id, def)
    }

    setParameters(id: string, parameters: UnknownParameters) {
        return (this.parameters[id] = parameters)
    }

    getTypeNodeName(type: string, def?: string) {
        return this.typeNodeName[type] || this.setTypeNodeName(type, def)
    }

    setTypeNodeName(type: string, nodeType: string) {
        return (this.typeNodeName[type] = nodeType)
    }

    getTypeParameters(type: string, def: UnknownParameters = {}) {
        return this.typeParameters[type] || this.setTypeParameters(type, def)
    }

    setTypeParameters(type: string, parameters: UnknownParameters) {
        return (this.typeParameters[type] = parameters)
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
