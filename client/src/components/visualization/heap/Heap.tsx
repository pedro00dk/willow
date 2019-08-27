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

export class HeapObjProps {
    private positions: { [reference: string]: { x: number; y: number }[] }
    private parameterSelector: { [reference: string]: 'reference' | 'type' }
    private referenceParameters: { [reference: string]: UnknownParameters }
    private typeParameters: { [languageType: string]: UnknownParameters }

    constructor() {
        this.positions = {}
        this.parameterSelector = {}
        this.referenceParameters = {}
        this.typeParameters = {}
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
        for (let i = range[0]; i <= range[1]; i += 1) referencePositions[i] = position
    }

    getParameterSelector(reference: string, def?: 'reference' | 'type') {
        return this.parameterSelector[reference]
            ? this.parameterSelector[reference]
            : (this.parameterSelector[reference] = def)
    }

    setParameterSelector(reference: string, selector: 'reference' | 'type') {
        this.parameterSelector[reference] = selector
    }

    getReferenceParameters(reference: string, def?: UnknownParameters) {
        return this.referenceParameters[reference]
            ? this.referenceParameters[reference]
            : (this.referenceParameters[reference] = def)
    }

    setReferenceParameters(reference: string, parameters: UnknownParameters) {
        this.referenceParameters[reference] = parameters
    }

    getTypeParameters(reference: string, def?: UnknownParameters) {
        return this.typeParameters[reference] ? this.typeParameters[reference] : (this.typeParameters[reference] = def)
    }

    setTypeParameters(type: string, parameters: UnknownParameters) {
        this.typeParameters[type] = parameters
    }

    readParameters<T extends UnknownParameters, U extends DefaultParameters>(parameters: T, defaults: U) {
        return Object.fromEntries(
            Object.entries(defaults).map(([name, defaults]) => {
                if (!parameters) return [name, defaults.value] as const
                const value = parameters[name]
                if (typeof value !== typeof defaults.value) return [name, defaults.value] as const
                return [name, value] as const
            })
        ) as ComputedParameters<U>
    }
}

const classes = {
    container: cn('d-flex', 'w-100 h-100'),
    line: cn('position-absolute', 'p-0 m-0')
}

export const Heap = React.memo(() => {
    const ref = React.useRef<HTMLDivElement>()
    const update = React.useState({})[1]
    const heapObjProps = React.useRef<HeapObjProps>(new HeapObjProps())
    const { tracer } = useRedux(state => ({ tracer: state.tracer }))

    return (
        <div ref={ref} className={classes.container}>
            <SvgView size={{ width: 750, height: 500 }} markers>
                {tracer.available && (
                    <g transform={`translate(${750 / 2},${500 / 2})`}>
                        {Object.values(tracer.heapsData[tracer.index]).map(objData => (
                            <Wrapper
                                tracer={tracer}
                                objData={objData}
                                heapObjProps={heapObjProps.current}
                                updateAll={update}
                            />
                        ))}
                    </g>
                )}
            </SvgView>
        </div>
    )
})
