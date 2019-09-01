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
    container: cn('d-flex align-items-center', 'text-nowrap'),
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
    value: cn('text-center text-truncate', css({ fontSize: '0.75rem' }))
}

const styles = {
    background: (changed: boolean) => (changed ? colors.red.light : colors.blue.light)
}

const defaultParameters = {
    'show index': { value: true },
    'max width': { value: 30, range: [5, 100] as [number, number] }
}

export const defaults: ReadonlySet<schema.Obj['type']> = new Set(['array', 'alist', 'tuple'])
export const supported: ReadonlySet<schema.Obj['type']> = new Set(['array', 'alist', 'llist', 'tuple'])

export const Node = (props: {
    objData: ObjData
    parameters: UnknownParameters
    onTargetRef: (id: string, target: string, ref: HTMLSpanElement) => void
}) => {
    const previousMembers = React.useRef<ObjData['members']>([])
    const parameters = readParameters(props.parameters, defaultParameters)

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
                    : props.objData.members.map((member, i) => {
                          const isPrimitive = typeof member.value !== 'object'
                          const changed = valueChanged(previousMembers.current[i], member)
                          const displayValue = getDisplayValue(props.objData, member.value)

                          return (
                              <div
                                  key={i}
                                  className={classes.element}
                                  style={{ maxWidth: parameters['max width'], background: styles.background(changed) }}
                                  title={displayValue}
                              >
                                  {parameters['show index'] && <span className={classes.index}>{i}</span>}
                                  <span
                                      ref={ref =>
                                          !isPrimitive &&
                                          props.onTargetRef(props.objData.id, (member.value as ObjData).id, ref)
                                      }
                                      className={classes.value}
                                  >
                                      {displayValue}
                                  </span>
                              </div>
                          )
                      })}
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
