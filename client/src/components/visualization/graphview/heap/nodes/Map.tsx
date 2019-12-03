import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../../../colors'
import * as schema from '../../../../../schema/schema'
import { Base, getDisplayValue, valueChanged } from '../../Base'
import { ComputedParameters, readParameters, UnknownParameters } from '../../GraphData'
import { Parameters } from '../Parameters'

const classes = {
    container: 'd-flex flex-column justify-content-center text-nowrap',
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

export const defaults: ReadonlySet<schema.Obj['gType']> = new Set(['map'])
export const supported: ReadonlySet<schema.Obj['gType']> = new Set(['array', 'linked', 'set', 'map'])

export const Node = (props: {
    id: string
    obj: schema.Obj
    parameters: UnknownParameters
    onTargetRef: (id: string, target: string, ref: HTMLSpanElement) => void
}) => {
    const previousMembers = React.useRef<schema.Member[]>([])
    const parameters = readParameters(props.parameters, defaultParameters)

    React.useEffect(() => void (previousMembers.current = props.obj.members))

    return (
        <Base title={props.obj.lType}>
            <div className={classes.container}>
                {!supported.has(props.obj.gType)
                    ? 'incompatible'
                    : props.obj.members.length === 0
                    ? 'empty'
                    : props.obj.members.map((member, i) => {
                          const keyIsPrimitive = typeof member.key !== 'object'
                          const valueIsPrimitive = typeof member.value !== 'object'
                          const changed = valueChanged(previousMembers.current[i], member)
                          const keyDisplayValue = getDisplayValue(props.id, member.key)
                          const valueDisplayValue = getDisplayValue(props.id, member.value)

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
                                              props.onTargetRef(props.id, (member.key as [string])[0], ref)
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
                                          props.onTargetRef(props.id, (member.value as [string])[0], ref)
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
    id: string
    obj: schema.Obj
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
