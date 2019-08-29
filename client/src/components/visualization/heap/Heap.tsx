import cn from 'classnames'
import * as React from 'react'
import { useRedux } from '../../../reducers/Store'
import { SvgView } from './SvgView'
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
    private parameterSelector: { [id: string]: 'id' | 'type' } = {}
    private idParameters: { [id: string]: UnknownParameters } = {}
    private typeParameters: { [languageType: string]: UnknownParameters } = {}
    private containers: { [id: string]: SVGForeignObjectElement } = {}
    private targets: { [id: string]: { target: string; element: HTMLSpanElement }[] } = {}
    private subscriptions: { [id: string]: ((subscriptionIndex: number) => void)[] } = {}
    private subscriptionsCalls = 0

    constructor(private viewSize: { width: number; height: number }) {}

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
            x: Math.min(Math.max(position.x, 0), this.viewSize.width * 0.95),
            y: Math.min(Math.max(position.y, 0), this.viewSize.height * 0.95)
        }
        for (let i = range[0]; i <= range[1]; i += 1) idPositions[i] = clampedPosition
        this.callSubscriptions(id)
        return clampedPosition
    }

    getParameterSelector(id: string, def?: 'id' | 'type') {
        return this.parameterSelector[id] ? this.parameterSelector[id] : (this.parameterSelector[id] = def)
    }

    setParameterSelector(id: string, selector: 'id' | 'type') {
        this.parameterSelector[id] = selector
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

    resetContainersAndTargets() {
        this.containers = {}
        this.targets = {}
    }

    getContainer(id: string) {
        return this.containers[id]
    }

    setContainer(id: string, element: SVGForeignObjectElement) {
        this.containers[id] = element
    }

    getTargets(id: string) {
        return this.targets[id] ? this.targets[id] : (this.targets[id] = [])
    }

    appendTarget(id: string, target: string, element: HTMLSpanElement) {
        this.getTargets(id).push({ target, element })
    }

    resetSubscriptions() {
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
    container: cn('d-flex', 'w-100 h-100'),
    line: cn('position-absolute', 'p-0 m-0')
}

export const Heap = React.memo(() => {
    const heapControl = React.useRef<HeapControl>(new HeapControl({ width: 1000, height: 700 }))
    const update = React.useState({})[1]
    const { tracer } = useRedux(state => ({ tracer: state.tracer }))
    const viewSize = heapControl.current.getViewSize()
    heapControl.current.resetContainersAndTargets()
    heapControl.current.resetSubscriptions()

    return (
        <div className={classes.container}>
            <SvgView size={viewSize} markers>
                {tracer.available &&
                    Object.values(tracer.heapsData[tracer.index]).map(objData => (
                        <Wrapper
                            tracer={tracer}
                            objData={objData}
                            heapControl={heapControl.current}
                            updateAll={update}
                        />
                    ))}
            </SvgView>
        </div>
    )
})
