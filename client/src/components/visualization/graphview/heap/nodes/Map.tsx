import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../../../colors'
import { ObjData } from '../../../../../reducers/tracer'
import * as schema from '../../../../../schema/schema'
import { Base, getDisplayValue, valueChanged } from '../../Base'
import { ComputedParameters, readParameters, UnknownParameters } from '../../GraphView'
import { Parameters } from '../Parameters'

const classes = {
    container: cn('d-flex flex-column justify-content-center', 'text-nowrap'),
    element: cn('d-inline-flex', css({ cursor: 'default' })),
    key: cn(
        'text-center text-truncate',
        css({
            borderLeft: `0.5px solid ${colors.gray.dark}`,
            borderTop: `0.5px solid ${colors.gray.dark}`,
            borderBottom: `0.5px solid ${colors.gray.dark}`,
            borderRight: `0.5px solid ${colors.gray.light}`,
            fontSize: '0.75rem'
        })
    ),
    value: cn(
        'text-center text-truncate',
        css({
            borderLeft: `0.5px solid ${colors.gray.light}`,
            borderTop: `0.5px solid ${colors.gray.dark}`,
            borderBottom: `0.5px solid ${colors.gray.dark}`,
            borderRight: `0.5px solid ${colors.gray.dark}`,
            fontSize: '0.75rem'
        })
    )
}

const styles = {
    background: (changed: boolean) => (changed ? colors.red.light : colors.blue.light)
}

const defaultParameters = {
    'show keys': { value: true },
    'key width': { value: 30, range: [10, 100] as [number, number] },
    'value width': { value: 50, range: [10, 100] as [number, number] }
}

export const defaults: ReadonlySet<schema.Obj['type']> = new Set(['map', 'other'])
export const supported: ReadonlySet<schema.Obj['type']> = new Set(['array', 'tuple', 'alist', 'llist', 'map', 'other'])

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
                          const keyIsPrimitive = typeof member.key !== 'object'
                          const valueIsPrimitive = typeof member.value !== 'object'
                          const changed = valueChanged(previousMembers.current[i], member)
                          const keyDisplayValue = getDisplayValue(props.objData, member.key)
                          const valueDisplayValue = getDisplayValue(props.objData, member.value)

                          return (
                              <div
                                  key={i}
                                  className={classes.element}
                                  style={{ background: styles.background(changed) }}
                                  title={valueDisplayValue}
                              >
                                  {parameters['show keys'] && (
                                      <span
                                          ref={ref =>
                                              ref &&
                                              !keyIsPrimitive &&
                                              props.onTargetRef(props.objData.id, (member.key as ObjData).id, ref)
                                          }
                                          className={classes.key}
                                          style={{ width: parameters['key width'] }}
                                      >
                                          {keyDisplayValue}
                                      </span>
                                  )}
                                  <span
                                      ref={ref =>
                                          ref &&
                                          !valueIsPrimitive &&
                                          props.onTargetRef(props.objData.id, (member.value as ObjData).id, ref)
                                      }
                                      className={classes.value}
                                      style={{ width: parameters['value width'] }}
                                  >
                                      {valueDisplayValue}
                                  </span>
                              </div>
                          )
                      })}
            </div>
        </Base>
    )
}

export const NodeParameters = (props: {
    objData: ObjData
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
