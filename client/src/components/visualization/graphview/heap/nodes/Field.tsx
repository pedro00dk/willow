import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../../../colors'
import { ObjData } from '../../../../../reducers/tracer'
import * as schema from '../../../../../schema/schema'
import { Base, getDisplayValue, valueChanged } from '../../Base'
import { ComputedParameters, readParameters, UnknownParameters } from '../../GraphController'
import { Parameters } from '../Parameters'

const classes = {
    container: 'd-flex align-items-center text-nowrap',
    element: cn(
        'd-inline-flex flex-column',
        'px-1',
        css({ border: `0.5px solid ${colors.gray.dark}`, cursor: 'default', fontSize: '1rem' })
    ),
    index: cn('text-truncate', css({ fontSize: '0.5rem' })),
    value: cn('text-center text-truncate', css({ fontSize: '0.75rem' }))
}

const styles = {
    background: (changed: boolean) => (changed ? colors.red.light : colors.blue.light)
}

const defaultParameters = {
    'member key': { value: '#', options: [] as string[] }
}

export const defaults: ReadonlySet<schema.Obj['type']> = new Set()
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
                    : parameters['member key'] === '#'
                    ? 'choose'
                    : (() => {
                          const previousFilteredMembers = previousMembers.current.filter(
                              member =>
                                  typeof member.key !== 'object' && member.key.toString() === parameters['member key']
                          )

                          const filteredMembers = props.objData.members.filter(
                              member =>
                                  typeof member.key !== 'object' && member.key.toString() === parameters['member key']
                          )

                          if (filteredMembers.length === 0) return 'not found'
                          if (filteredMembers.length > 1) return 'many found'

                          const chosenMember = filteredMembers[0]
                          const isPrimitive = typeof chosenMember.value !== 'object'
                          const changed = valueChanged(previousFilteredMembers[0], chosenMember)
                          const displayValue = getDisplayValue(props.objData, chosenMember.value)
                          const objectMemberKeysOrValues = [
                              ...props.objData.members
                                  .filter(member => typeof member.key === 'object')
                                  .map(member => member.key as ObjData),
                              ...props.objData.members
                                  .filter(member => typeof member.value === 'object' && member !== chosenMember)
                                  .map(member => member.value as ObjData)
                          ]

                          return (
                              <>
                                  <div
                                      className={classes.element}
                                      style={{ background: styles.background(changed) }}
                                      title={displayValue}
                                  >
                                      <span
                                          ref={ref =>
                                              ref &&
                                              !isPrimitive &&
                                              props.onTargetRef(
                                                  props.objData.id,
                                                  (chosenMember.value as ObjData).id,
                                                  ref
                                              )
                                          }
                                          className={classes.value}
                                      >
                                          {displayValue}
                                      </span>
                                  </div>
                                  <span
                                      ref={ref =>
                                          ref &&
                                          objectMemberKeysOrValues.forEach(objData =>
                                              props.onTargetRef(props.objData.id, objData.id, ref)
                                          )
                                      }
                                  />
                              </>
                          )
                      })()}
            </div>
        </Base>
    )
}

export const NodeParameters = (props: {
    objData: ObjData
    withReset: boolean
    parameters: UnknownParameters
    onChange: (updatedParameters: ComputedParameters<typeof defaultParameters>) => void
}) => {
    const memberKeyOptions = props.objData.members
        .filter(member => typeof member.key !== 'object')
        .map(member => member.key.toString())
    return (
        <Parameters
            withReset={props.withReset}
            parameters={props.parameters}
            defaults={{
                ...defaultParameters,
                'member key': {
                    value: defaultParameters['member key'].value,
                    options: [defaultParameters['member key'].value, ...memberKeyOptions]
                }
            }}
            onChange={props.onChange}
        />
    )
}
