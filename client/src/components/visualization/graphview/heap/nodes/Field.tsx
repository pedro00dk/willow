import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../../../colors'
import * as schema from '../../../../../schema/schema'
import { Base, getDisplayValue, memberChanged } from '../../Base'
import { ComputedParameters, readParameters, UnknownParameters } from '../../GraphData'
import { Parameters } from '../Parameters'

const classes = {
    container: 'd-flex align-items-center text-nowrap',
    elements: 'd-flex',
    element: cn(
        'd-inline-flex flex-column px-1',
        css({ border: `0.5px solid ${colors.gray.dark}`, cursor: 'default', fontSize: '1rem' })
    ),
    index: cn('text-truncate', css({ fontSize: '0.5rem' })),
    value: cn('text-center text-truncate', css({ fontSize: '0.75rem' }))
}

const styles = {
    direction: (references: 'right' | 'bottom') => (references === 'right' ? 'row' : 'column'),
    background: (changed: boolean) => (changed ? colors.red.light : colors.blue.light)
}

export const defaultParameters = {
    member: { value: '#', options: [] as string[] },
    references: { value: 'right', options: ['right', 'bottom'] }
}

export const defaults: ReadonlySet<schema.Obj['gType']> = new Set()
export const supported: ReadonlySet<schema.Obj['gType']> = new Set(['array', 'linked', 'map'])

export const Node = (props: {
    id: string
    obj: schema.Obj
    parameters: UnknownParameters
    onTargetRef: (id: string, target: string, ref: HTMLSpanElement) => void
}) => {
    const currentMembers = React.useRef<schema.Member[]>([])
    const parameters = readParameters(props.parameters, defaultParameters)

    React.useEffect(() => void (currentMembers.current = props.obj.members))

    return (
        <Base title={props.obj.lType}>
            <div className={classes.container}>
                {!supported.has(props.obj.gType)
                    ? 'incompatible'
                    : parameters.member === '#'
                    ? 'choose'
                    : (() => {
                          const filteredMembers = props.obj.members.filter(
                              member => typeof member.key !== 'object' && member.key.toString() === parameters.member
                          )
                          if (filteredMembers.length === 0) return 'not found'
                          if (filteredMembers.length > 1) return 'many found'
                          const currentMember = currentMembers.current.filter(
                              member => typeof member.key !== 'object' && member.key.toString() === parameters.member
                          )[0]
                          const chosenMember = filteredMembers[0]
                          const isPrimitive = typeof chosenMember.value !== 'object'
                          const changed = memberChanged(currentMember, chosenMember)
                          const displayValue = getDisplayValue(props.id, chosenMember.value)
                          const memberIds = [
                              ...props.obj.members
                                  .filter(member => typeof member.key === 'object')
                                  .map(member => (member.key as [string])[0]),
                              ...props.obj.members
                                  .filter(member => typeof member.value === 'object' && member !== chosenMember)
                                  .map(member => (member.value as [string])[0])
                          ]

                          return (
                              <div
                                  className={classes.elements}
                                  style={{ flexDirection: parameters.references === 'right' ? 'row' : 'column' }}
                              >
                                  <div
                                      className={classes.element}
                                      style={{
                                          background: styles.background(changed)
                                      }}
                                      title={displayValue}
                                  >
                                      <span
                                          ref={ref =>
                                              ref &&
                                              !isPrimitive &&
                                              props.onTargetRef(props.id, (chosenMember.value as [string])[0], ref)
                                          }
                                          className={classes.value}
                                      >
                                          {displayValue}
                                      </span>
                                  </div>
                                  <span
                                      ref={ref => ref && memberIds.forEach(id => props.onTargetRef(props.id, id, ref))}
                                  />
                              </div>
                          )
                      })()}
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
}) => {
    const memberOptions = props.obj.members
        .filter(member => typeof member.key !== 'object')
        .map(member => member.key.toString())
    return (
        <Parameters
            withReset={props.withReset}
            parameters={props.parameters}
            defaults={{
                ...defaultParameters,
                member: {
                    value: defaultParameters.member.value,
                    options: [defaultParameters.member.value, ...memberOptions]
                }
            }}
            onChange={props.onChange}
        />
    )
}
