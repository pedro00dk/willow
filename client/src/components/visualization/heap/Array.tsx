import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../colors'
import { ObjData } from '../../../reducers/tracer'
import * as schema from '../../../schema/schema'
import { Base } from './Base'
import { ComputedParameters, readParameters, UnknownParameters } from './Parameters'
import { Parameters } from './Parameters'

const classes = {
    container: cn('d-flex align-items-center', 'text-nowrap'),
    element: cn(
        'd-inline-flex flex-column',
        'px-1',
        css({
            border: `0.5px solid ${colors.gray.dark}`,
            cursor: 'default',
            fontSize: '1rem',
            background: colors.blue.light
        })
    ),
    index: cn('text-truncate', css({ fontSize: '0.5rem' })),
    value: cn('text-center text-truncate', css({ fontSize: '0.75rem' }))
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
    const parameters = readParameters(props.parameters, defaultParameters)
    return (
        <Base title={props.objData.languageType} onRef={ref => undefined}>
            <div className={classes.container}>
                {!isSupported(props.objData)
                    ? 'incompatible'
                    : props.objData.members.length === 0
                    ? 'empty'
                    : props.objData.members.map((member, i) => {
                          const isReference = typeof member.value === 'object'
                          const value = isReference ? '::' : member.value
                          return (
                              <div
                                  key={i}
                                  className={classes.element}
                                  style={{ maxWidth: parameters['max width'] }}
                                  title={value.toString()}
                              >
                                  {parameters['show index'] && <span className={classes.index}>{i}</span>}
                                  <span className={classes.value}>{value}</span>
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
