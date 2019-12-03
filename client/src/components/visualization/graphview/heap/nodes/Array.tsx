import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../../../colors'
import * as schema from '../../../../../schema/schema'
import { Base, getDisplayValue, valueChanged } from '../../Base'
import { ComputedParameters, readParameters, UnknownParameters } from '../../GraphData'
import { Parameters } from '../Parameters'

const classes = {
    container: 'd-flex text-nowrap',
    chunk: 'd-flex',
    element: cn(
        'd-inline-flex px-1',
        css({ border: `0.5px solid ${colors.gray.dark}`, cursor: 'default', fontSize: '1rem' })
    ),
    index: cn('text-truncate mr-1', css({ fontSize: '0.5rem' })),
    value: cn('text-center text-truncate', css({ fontSize: '0.75rem' }))
}

const styles = {
    background: (changed: boolean) => (changed ? colors.red.light : colors.blue.light)
}

const defaultParameters = {
    index: { value: true },
    width: { value: 30, range: [5, 100] as [number, number] },
    direction: { value: 'row', options: ['row', 'column'] },
    wrap: { value: 'Infinity', options: [...[...Array(100).keys()].map(i => (i + 1).toString()), Infinity.toString()] },
    'wrap index': { value: false }
}

export const defaults: ReadonlySet<schema.Obj['gType']> = new Set(['array', 'linked', 'set'])
export const supported: ReadonlySet<schema.Obj['gType']> = new Set(['array', 'linked', 'set'])

export const Node = (props: {
    id: string
    obj: schema.Obj
    parameters: UnknownParameters
    onTargetRef: (id: string, target: string, ref: HTMLSpanElement) => void
}) => {
    const currentMembers = React.useRef<schema.Member[]>([])
    const parameters = readParameters(props.parameters, defaultParameters)
    const wrap = parseFloat(parameters.wrap)
    const chunkSize = isFinite(wrap) ? wrap : props.obj.members.length
    const chunks = props.obj.members.reduce((acc, next, i) => {
        const chunkIndex = Math.floor(i / chunkSize)
        const chunk = acc[chunkIndex] ?? (acc[chunkIndex] = [])
        chunk.push(next)
        return acc
    }, [] as schema.Member[][])

    React.useEffect(() => void (currentMembers.current = props.obj.members))

    return (
        <Base title={props.obj.lType}>
            <div
                className={classes.container}
                style={{ flexDirection: parameters.direction === 'row' ? 'column' : 'row' }}
            >
                {!supported.has(props.obj.gType)
                    ? 'incompatible'
                    : props.obj.members.length === 0
                    ? 'empty'
                    : chunks.map((chunk, i) => (
                          <div key={i} className={classes.chunk} style={{ flexDirection: parameters.direction as any }}>
                              {chunk.map((member, j) => {
                                  const memberIndex = i * chunkSize + j
                                  const showIndex = !parameters['wrap index'] ? memberIndex : j
                                  const isPrimitive = typeof member.value !== 'object'
                                  const changed = valueChanged(currentMembers.current[memberIndex], member)
                                  const displayValue = getDisplayValue(props.id, member.value)

                                  return (
                                      <div
                                          key={memberIndex}
                                          className={classes.element}
                                          style={{
                                              width: parameters.width,
                                              background: styles.background(changed),
                                              flexDirection: parameters.direction === 'row' ? 'column' : 'row'
                                          }}
                                          title={displayValue}
                                      >
                                          {parameters.index && <span className={classes.index}>{showIndex}</span>}
                                          <span
                                              ref={ref =>
                                                  ref &&
                                                  !isPrimitive &&
                                                  props.onTargetRef(props.id, (member.value as [string])[0], ref)
                                              }
                                              className={classes.value}
                                          >
                                              {displayValue}
                                          </span>
                                      </div>
                                  )
                              })}
                          </div>
                      ))}
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
