import cn from 'classnames'
import * as React from 'react'
import { useRedux } from '../../../reducers/Store'
import { clamp } from '../../../Utils'
import { View } from './View'
import { Wrapper } from './Wrapper'

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
        Object.entries(defaults).map(([name, defaults]) => {
            if (!parameters) return [name, defaults.value] as const
            const value = parameters[name]
            if (typeof value !== typeof defaults.value) return [name, defaults.value] as const
            return [name, value] as const
        })
    ) as ComputedParameters<U>

export class HeapControl {
    private positions: { [id: string]: { x: number; y: number }[] } = {}
    private sizes: { [id: string]: { x: number; y: number }[] } = {}
    private targets: { [id: string]: { target: string; delta: { x: number; y: number } }[] } = {}
    private parameterSelector: { [id: string]: 'id' | 'type' } = {}
    private idNodeName: { [id: string]: string } = {}
    private typeNodeName: { [type: string]: string } = {}
    private idParameters: { [id: string]: UnknownParameters } = {}
    private typeParameters: { [type: string]: UnknownParameters } = {}
    private subscriptions: { [id: string]: ((subscriptionIndex: number) => void)[] } = {}
    private subscriptionsCalls = 0

    constructor(private viewSize: { x: number; y: number }) {}

    getViewSize() {
        return this.viewSize
    }

    getPosition(id: string, index: number, def?: { x: number; y: number }) {
        const idPositions = this.positions[id] ? this.positions[id] : (this.positions[id] = [])
        return idPositions[index] ? idPositions[index] : this.setPositionRange(id, [index, index], def)
    }

    setPositionRange(id: string, range: [number, number], position: { x: number; y: number }) {
        const idPositions = this.positions[id] ? this.positions[id] : (this.positions[id] = [])
        const clampedPosition = {
            x: clamp(position.x, 0, this.viewSize.x * 0.95),
            y: clamp(position.y, 0, this.viewSize.y * 0.95)
        }
        for (let i = range[0]; i <= range[1]; i += 1) idPositions[i] = clampedPosition
        return clampedPosition
    }

    getSize(id: string, index: number, def?: { x: number; y: number }) {
        const idSizes = this.sizes[id] ? this.sizes[id] : (this.sizes[id] = [])
        return idSizes[index] ? idSizes[index] : this.setSizeRange(id, [index, index], def)
    }

    setSizeRange(id: string, range: [number, number], size: { x: number; y: number }) {
        const idSizes = this.sizes[id] ? this.sizes[id] : (this.sizes[id] = [])
        for (let i = range[0]; i <= range[1]; i += 1) idSizes[i] = size
        return size
    }

    clearTargets() {
        this.targets = {}
    }

    getTargets(id: string) {
        return this.targets[id] ? this.targets[id] : (this.targets[id] = [])
    }

    setTargets(id: string, targets: { target: string; delta: { x: number; y: number } }[]) {
        this.targets[id] = targets
    }

    getParameterSelector(id: string, def?: 'id' | 'type') {
        return this.parameterSelector[id] ? this.parameterSelector[id] : (this.parameterSelector[id] = def)
    }

    setParameterSelector(id: string, selector: 'id' | 'type') {
        this.parameterSelector[id] = selector
    }

    getIdNodeName(id: string, def?: string) {
        return this.idNodeName[id] ? this.idNodeName[id] : (this.idNodeName[id] = def)
    }

    setIdNodeName(id: string, nodeType: string) {
        this.idNodeName[id] = nodeType
    }

    getTypeNodeName(id: string, def?: string) {
        return this.typeNodeName[id] ? this.typeNodeName[id] : (this.typeNodeName[id] = def)
    }

    setTypeNodeName(id: string, nodeType: string) {
        this.typeNodeName[id] = nodeType
    }

    getIdParameters(id: string, def?: UnknownParameters) {
        return this.idParameters[id] ? this.idParameters[id] : (this.idParameters[id] = def)
    }

    setIdParameters(id: string, parameters: UnknownParameters) {
        this.idParameters[id] = parameters
    }

    getTypeParameters(id: string, def?: UnknownParameters) {
        return this.typeParameters[id] ? this.typeParameters[id] : (this.typeParameters[id] = def)
    }

    setTypeParameters(type: string, parameters: UnknownParameters) {
        this.typeParameters[type] = parameters
    }

    clearSubscriptions() {
        this.subscriptions = {}
    }

    subscribe(id: string, callback: (subscriptionIndex: number) => void) {
        if (!this.subscriptions[id]) this.subscriptions[id] = []
        this.subscriptions[id].push(callback)
    }

    callSubscriptions(id?: string) {
        const subscriptionIndex = this.subscriptionsCalls++
        if (!id)
            Object.values(this.subscriptions) //
                .forEach(subscriptions => subscriptions.forEach(subscription => subscription(subscriptionIndex)))
        else if (this.subscriptions[id]) this.subscriptions[id].forEach(subscription => subscription(subscriptionIndex))
    }
}

const classes = {
    container: cn('d-flex', 'w-100 h-100')
}

export const Heap = React.memo(() => {
    const heapControl = React.useRef<HeapControl>(new HeapControl({ x: 2000, y: 600 }))
    const updateHeap = React.useState({})[1]
    const { tracer } = useRedux(state => ({ tracer: state.tracer }))
    heapControl.current.clearTargets()
    heapControl.current.clearSubscriptions()

    return (
        <div className={classes.container}>
            <View size={heapControl.current.getViewSize()}>
                {tracer.available &&
                    Object.values(tracer.heapsData[tracer.index]).map(objData => (
                        <Wrapper
                            objData={objData}
                            heapControl={heapControl.current}
                            updateHeap={updateHeap}
                            tracer={tracer}
                        />
                    ))}
            </View>
        </div>
    )
})
