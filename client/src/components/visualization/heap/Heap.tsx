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

export class HeapObjProps {
    private positions: { [reference: string]: { x: number; y: number }[] }
    private parameterSelector: { [reference: string]: 'reference' | 'type' }
    private referenceParameters: { [reference: string]: UnknownParameters }
    private typeParameters: { [languageType: string]: UnknownParameters }

    constructor(private viewSize: { width: number; height: number }) {
        this.positions = {}
        this.parameterSelector = {}
        this.referenceParameters = {}
        this.typeParameters = {}
    }

    getViewSize() {
        return this.viewSize
    }

    getPosition(reference: string, index: number, def?: { x: number; y: number }) {
        const referencePositions = this.positions[reference]
            ? this.positions[reference]
            : (this.positions[reference] = [])
        return referencePositions[index] ? referencePositions[index] : (referencePositions[index] = def)
    }

    setRangePosition(reference: string, range: [number, number], position: { x: number; y: number }) {
        const referencePositions = this.positions[reference]
            ? this.positions[reference]
            : (this.positions[reference] = [])

        const clampedPosition = {
            x: Math.min(Math.max(position.x, 0), this.viewSize.width * 0.95),
            y: Math.min(Math.max(position.y, 0), this.viewSize.height * 0.95)
        }
        for (let i = range[0]; i <= range[1]; i += 1) referencePositions[i] = clampedPosition

        return clampedPosition
    }

    getParameterSelector(reference: string, def?: 'reference' | 'type') {
        return this.parameterSelector[reference]
            ? this.parameterSelector[reference]
            : (this.parameterSelector[reference] = def)
    }

    setParameterSelector(reference: string, selector: 'reference' | 'type') {
        return (this.parameterSelector[reference] = selector)
    }

    getReferenceParameters(reference: string, def?: UnknownParameters) {
        return this.referenceParameters[reference]
            ? this.referenceParameters[reference]
            : (this.referenceParameters[reference] = def)
    }

    setReferenceParameters(reference: string, parameters: UnknownParameters) {
        return (this.referenceParameters[reference] = parameters)
    }

    getTypeParameters(reference: string, def?: UnknownParameters) {
        return this.typeParameters[reference] ? this.typeParameters[reference] : (this.typeParameters[reference] = def)
    }

    setTypeParameters(type: string, parameters: UnknownParameters) {
        return (this.typeParameters[type] = parameters)
    }
}

const classes = {
    container: cn('d-flex', 'w-100 h-100'),
    line: cn('position-absolute', 'p-0 m-0')
}

export const Heap = React.memo(() => {
    const ref = React.useRef<HTMLDivElement>()
    const update = React.useState({})[1]
    const heapObjProps = React.useRef<HeapObjProps>(new HeapObjProps({ width: 1000, height: 1000 }))
    const { tracer } = useRedux(state => ({ tracer: state.tracer }))
    const viewSize = heapObjProps.current.getViewSize()

    return (
        <div ref={ref} className={classes.container}>
            <SvgView size={viewSize} markers>
                {tracer.available &&
                    Object.values(tracer.heapsData[tracer.index]).map(objData => (
                        <Wrapper
                            tracer={tracer}
                            objData={objData}
                            heapObjProps={heapObjProps.current}
                            updateAll={update}
                        />
                    ))}
            </SvgView>
        </div>
    )
})
