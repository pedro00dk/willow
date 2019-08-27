import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../colors'
import { ObjData } from '../../../reducers/tracer'
import * as schema from '../../../schema/schema'
import { Base } from './Base'
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

const defaults = new Set<schema.Obj['type']>(['array', 'alist', 'tuple'])
const supported = new Set<schema.Obj['type']>(['array', 'alist', 'llist', 'tuple'])

const defaultParameters = {
    'show index': { value: true },
    'max width': { value: 30, range: [5, 100] as [number, number] }
}

export const isDefault = (objData: ObjData) => defaults.has(objData.type)
export const isSupported = (objData: ObjData) => supported.has(objData.type)

export const Node = (props: { objData: ObjData; parameters: UnknownParameters }) => {
    const previousMembers = React.useRef<ObjData['members']>([])

    const parameters = readParameters(props.parameters, defaultParameters)

    React.useEffect(() => {
        previousMembers.current = props.objData.members
    })

    return (
        <Base title={props.objData.languageType}>
            <div className={classes.container}>
                {!isSupported(props.objData)
                    ? 'incompatible'
                    : props.objData.members.length === 0
                    ? 'empty'
                    : props.objData.members.map((member, i) => {
                          const value = member.value
                          const previousValue =
                              previousMembers.current.length > i ? previousMembers.current[i].value : undefined
                          const isReference = typeof value === 'object'
                          const previousIsReference = typeof previousValue === 'object'
                          const changed =
                              isReference !== previousIsReference ||
                              (isReference && (value as ObjData).reference !== (previousValue as ObjData).reference) ||
                              value !== previousValue
                          const shownValue = isReference ? '::' : value

                          return (
                              <div
                                  key={i}
                                  className={classes.element}
                                  style={{
                                      maxWidth: parameters['max width'],
                                      background: styles.background(changed)
                                  }}
                                  title={shownValue.toString()}
                              >
                                  {parameters['show index'] && <span className={classes.index}>{i}</span>}
                                  <span className={classes.value}>{shownValue}</span>
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
    ></Parameters>
)
