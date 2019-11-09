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
    private positions: { [id: string]: { x: number; y: number }[] } = {}
    private sizes: { [id: string]: { x: number; y: number }[] } = {}
    private targets: { [id: string]: { id: string; delta: { x: number; y: number } }[] } = {}
    private selector: { [id: string]: 'id' | 'type' } = {}
    private nodeName: { [id: string]: string } = {}
    private parameters: { [id: string]: UnknownParameters } = {}
    private typeNodeName: { [type: string]: string } = {}
    private typeParameters: { [type: string]: UnknownParameters } = {}

    subscribe(id: string, callback: (subscriptionCall: number) => void) {
        ;(this.subscriptions[id] || (this.subscriptions[id] = [])).push(callback)
    }

    callSubscriptions(id?: string) {
        const subscriptionCall = this.subscriptionCalls++
        ;(id ? Object.values(this.subscriptions).flat() : this.subscriptions[id]).forEach(s => s(subscriptionCall))
    }

    clearSubscriptions() {
        this.subscriptions = {}
    }

    getPosition(id: string, index: number, def?: { x: number; y: number }) {
        const positions = this.positions[id] || (this.positions[id] = [])
        return positions[index] || this.setPositionRange(id, [index, index], def)
    }

    setPositionRange(id: string, range: [number, number], position: { x: number; y: number }) {
        const positions = this.positions[id] || (this.positions[id] = [])
        for (let i = range[0]; i <= range[1]; i += 1) positions[i] = position
        return position
    }

    getSize(id: string, index: number, def?: { x: number; y: number }) {
        const sizes = this.sizes[id] || (this.sizes[id] = [])
        return sizes[index] ? sizes[index] : this.setSizeRange(id, [index, index], def)
    }

    setSizeRange(id: string, range: [number, number], size: { x: number; y: number }) {
        const sizes = this.sizes[id] || (this.sizes[id] = [])
        for (let i = range[0]; i <= range[1]; i += 1) sizes[i] = size
        return size
    }

    getTargets(id: string) {
        return this.targets[id] || (this.targets[id] = [])
    }

    setTargets(id: string, targets: { id: string; delta: { x: number; y: number } }[]) {
        this.targets[id] = targets
    }

    clearTargets() {
        this.targets = {}
    }

    getSelector(id: string, def?: 'id' | 'type') {
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

    getParameters(id: string, def?: UnknownParameters) {
        return this.parameters[id] || this.setParameters(id, def)
    }

    setParameters(id: string, parameters: UnknownParameters) {
        return (this.parameters[id] = parameters)
    }

    getTypeNodeName(type: string, def?: string) {
        return this.typeNodeName[type] || this.setTypeNodeName(type, def)
    }

    setTypeNodeName(type: string, nodeType: string) {
        this.typeNodeName[type] = nodeType
    }

    getTypeParameters(type: string, def?: UnknownParameters) {
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
