import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../colors'
import { ObjData } from '../../../reducers/tracer'
import * as schema from '../../../schema/schema'
import { Base, getDisplayValue, valueChanged } from './Base'
import { ComputedParameters, readParameters, UnknownParameters } from './Heap'
import { Parameters } from './Parameters'

const classes = {
    container: cn('d-flex align-items-end', 'text-nowrap'),
    element: cn(
        'd-inline-flex flex-column',
        'px-1',
        css({
            border: `0.5px solid ${colors.gray.dark}`,
            cursor: 'default',
            fontSize: '1rem'
        })
    ),
    index: cn('text-truncate', css({ fontSize: '0.5rem' })),
    value: cn('text-center text-truncate', css({ fontSize: '0.75rem' })),
    bar: cn(css({ borderBottom: `1px solid ${colors.gray.dark}` }))
}

const styles = {
    background: (changed: boolean) => (changed ? colors.red.light : colors.blue.light)
}

const defaultParameters = {
    mode: { value: 'delta', options: ['delta', 'fixed'] },
    'show index': { value: true },
    'show values': { value: true },
    width: { value: 30, range: [5, 100] as [number, number] },
    height: { value: 50, range: [5, 200] as [number, number] }
}

export const defaults: ReadonlySet<schema.Obj['type']> = new Set()
export const supported: ReadonlySet<schema.Obj['type']> = new Set(['array', 'alist', 'llist', 'tuple'])

export const Node = (props: {
    objData: ObjData
    parameters: UnknownParameters
    onTargetRef: (id: string, target: string, ref: HTMLSpanElement) => void
}) => {
    const previousMembers = React.useRef<ObjData['members']>([])
    const parameters = readParameters(props.parameters, defaultParameters)

    const computeDeltaRatios = (values: number[]) => {
        const min = Math.min(...values)
        const max = Math.max(...values)
        const delta = max - min !== 0 ? max - min : 1
        return values.map(value => (value - min) / delta)
    }

    const computeFixedRatios = (values: number[]) => {
        const indexedValues = values.map((value, i) => [value, i])
        indexedValues.sort((a, b) => a[0] - b[0])
        const sequenceGenerator = { previous: -Infinity, sequence: 0 }
        const sequenceIndices = indexedValues.map(([value, i]) => {
            if (sequenceGenerator.previous !== value) {
                sequenceGenerator.previous = value
                return [++sequenceGenerator.sequence, i]
            }
            return [sequenceGenerator.sequence, i]
        })
        const min = sequenceIndices[0][0]
        const max = sequenceIndices[sequenceIndices.length - 1][0]
        const delta = max - min !== 0 ? max - min : 1
        const ratioIndices = sequenceIndices.map(([value, i]) => [(value - min) / delta, i])
        ratioIndices.sort((a, b) => a[1] - b[1])
        return ratioIndices.map(([value, i]) => value)
    }

    React.useEffect(() => {
        previousMembers.current = props.objData.members
    })

    return (
        <Base title={props.objData.languageType}>
            <div className={classes.container}>
                {!supported.has(props.objData.type)
                    ? 'incompatible'
                    : props.objData.members.length === 0
                    ? 'empty'
                    : props.objData.members.some(member => typeof member.value !== 'number' || !isFinite(member.value))
                    ? 'no number'
                    : (() => {
                          const values = props.objData.members.map(member => member.value as number)
                          const ratios =
                              parameters['mode'] === 'delta' ? computeDeltaRatios(values) : computeFixedRatios(values)
                          return props.objData.members.map((member, i) => {
                              const changed = valueChanged(previousMembers.current[i], member)
                              const displayValue = getDisplayValue(props.objData, member.value)

                              return (
                                  <div
                                      key={i}
                                      className={classes.element}
                                      style={{ width: parameters['width'], background: styles.background(changed) }}
                                      title={displayValue}
                                  >
                                      <div
                                          className={classes.bar}
                                          style={{ height: `${ratios[i] * parameters['height']}px` }}
                                      />
                                      {parameters['show index'] && <span className={classes.index}>{i}</span>}
                                      {parameters['show values'] && <span className={classes.value}>{values[i]}</span>}
                                  </div>
                              )
                          })
                      })()}
            </div>
        </Base>
    )
}

export const NodeParameters = (props: {
    withReset: boolean
    parameters: UnknownParameters
    onChange: (updatedParameters: ComputedParameters<typeof defaultParameters>) => void
}) => (
    <Parameters
        withReset={props.withReset}
        parameters={props.parameters}
        defaults={defaultParameters}
        onChange={props.onChange}
    />
)
