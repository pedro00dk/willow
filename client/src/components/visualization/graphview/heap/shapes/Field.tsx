import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../../../colors'
import * as schema from '../../../../../schema/schema'
import { Base } from './Base'
import { ComputedParameters, Edge, readParameters, UnknownParameters } from '../../GraphData'
import { getDisplayValue, getMemberName, isSameMember, isValueObject } from '../../SchemaUtils'
import { Parameters } from '../Parameters'

const classes = {
    container: 'd-flex text-nowrap',
    elements: 'd-flex',
    element: cn('d-flex flex-column px-1', css({ border: `0.5px solid ${colors.gray.dark}` })),
    key: cn('text-truncate mr-1', css({ fontSize: '0.5rem' })),
    value: cn('text-center text-truncate', css({ fontSize: '0.75rem' }))
}

const styles = {
    background: (changed: boolean) => (changed ? colors.yellow.light : colors.blue.light),
    edge: (changed: boolean) => (changed ? colors.yellow.darker : colors.gray.dark)
}

const defaultParameters = {
    'choose a member': { value: undefined as string, options: [] as string[] },
    'show key': { value: true },
    'show references': { value: false },
    'references position': { value: 'right', options: ['right', 'bottom'] }
}

const getChosenMember = (parameters: ComputedParameters<typeof defaultParameters>, members: schema.Member[]) => {
    let chosenMember = parameters['choose a member']
    let chosenMemberIsSelectable = false
    let selectableMembers = members
        .filter(member => !isValueObject(member.key))
        .map(member => {
            const memberKey = member.key.toString()
            chosenMemberIsSelectable = chosenMemberIsSelectable || memberKey === chosenMember
            return memberKey
        })
    if (chosenMember == undefined || !chosenMemberIsSelectable) chosenMember = selectableMembers[0]
    return { chosenMember, selectableMembers }
}

export const defaults: ReadonlySet<schema.Obj['gType']> = new Set()
export const supported: ReadonlySet<schema.Obj['gType']> = new Set(['array', 'linked', 'map'])

export const Shape = (props: {
    id: string
    obj: schema.Obj
    parameters: UnknownParameters
    onLink: (
        link: { id: string; ref$: HTMLSpanElement } & Pick<Partial<Edge>, 'draw' | 'color' | 'width' | 'text'>
    ) => void
}) => {
    const currentMembers = React.useRef<{ [id: string]: schema.Member }>({})
    const parameters = readParameters(props.parameters, defaultParameters)
    const { chosenMember } = getChosenMember(parameters, props.obj.members)
    const showKey = parameters['show key']
    const showReferences = parameters['show references']
    const referencesPosition = parameters['references position']

    React.useEffect(() => {
        currentMembers.current = props.obj.members.reduce((acc, member) => {
            acc[getMemberName(member)] = member
            return acc
        }, {} as { [name: string]: schema.Member })
    })

    const renderField = (member: schema.Member) => {
        const displayKey = getDisplayValue(member.key, props.id)
        const displayValue = getDisplayValue(member.value, props.id)
        const isObject = isValueObject(member.value)
        const changed = !isSameMember(member, currentMembers.current[getMemberName(member)])

        return (
            <div
                className={classes.elements}
                style={{ flexDirection: referencesPosition === 'right' ? 'row' : 'column' }}
            >
                <div
                    className={classes.element}
                    style={{ background: styles.background(changed) }}
                    title={displayValue}
                >
                    {showKey && <span className={classes.key}>{displayKey}</span>}
                    <span
                        ref={ref$ => {
                            if (!ref$ || !isObject) return
                            const targetId = (member.value as [string])[0]
                            props.onLink({ id: targetId, ref$, color: styles.edge(changed), text: displayKey })
                        }}
                        className={classes.value}
                    >
                        {displayValue}
                    </span>
                </div>
                {showReferences && renderReferences(member)}
            </div>
        )
    }

    const renderReferences = (member: schema.Member) => (
        <span
            ref={ref$ => {
                if (!ref$) return
                props.obj.members.forEach(refMember => {
                    if (!isValueObject(refMember.value) || refMember === member) return
                    const targetId = (refMember.value as [string])[0]
                    const displayKey = getDisplayValue(refMember.key, props.id)
                    const changed = !isSameMember(refMember, currentMembers.current[getMemberName(refMember)])
                    props.onLink({ id: targetId, ref$, color: styles.edge(changed), text: displayKey })
                })
            }}
        />
    )

    return (
        <Base title={props.obj.lType}>
            <div className={classes.container}>
                {!supported.has(props.obj.gType)
                    ? 'incompatible'
                    : chosenMember === undefined
                    ? 'empty'
                    : (() => {
                          const member = props.obj.members.filter(
                              member => !isValueObject(member.key) && member.key.toString() === chosenMember
                          )[0]
                          return renderField(member)
                      })()}
            </div>
        </Base>
    )
}

export const ShapeParameters = (props: {
    id: string
    obj: schema.Obj
    withReset: boolean
    parameters: UnknownParameters
    onChange: (updatedParameters: ComputedParameters<typeof defaultParameters>) => void
}) => {
    const parameters = readParameters(props.parameters, defaultParameters)
    const { chosenMember, selectableMembers } = getChosenMember(parameters, props.obj.members)

    return (
        <Parameters
            withReset={props.withReset}
            parameters={props.parameters}
            defaults={{ ...defaultParameters, 'choose a member': { value: chosenMember, options: selectableMembers } }}
            onChange={props.onChange}
        />
    )
}
