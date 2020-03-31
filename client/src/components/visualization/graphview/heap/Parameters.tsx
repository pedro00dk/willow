import React from 'react'
import { Item } from 'react-contexify'
import * as tracer from '../../../../types/tracer'
import { ComputedParameters, DefaultParameters, UnknownParameters } from '../Graph'
import { isValueObject, getMemberName } from '../TracerUtils'

const FlagParameter = (props: { name: string; value: boolean; onChange: (value: boolean) => void }) => (
    <Item>
        <span>{props.name}</span>
        <input type='checkbox' checked={props.value} onChange={event => props.onChange(event.target.checked)} />
    </Item>
)

const RangeParameter = (props: {
    name: string
    value: number
    range: [number, number]
    onChange: (value: number) => void
}) => (
    <Item>
        <span>{props.name}</span>
        <input
            type='range'
            value={props.value}
            min={props.range[0]}
            max={props.range[1]}
            onChange={event => props.onChange(event.target.valueAsNumber)}
        />
    </Item>
)

const EnumParameter = (props: {
    name: string
    value: string
    options: string[]
    onChange: (value: string) => void
}) => (
    <Item>
        <span>{props.name}</span>
        <select value={props.value} onChange={event => props.onChange(event.target.value)}>
            {props.options.map(option => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </Item>
)

const MemberParameter = (props: {
    name: string
    value: string | undefined
    members: 'all' | 'values' | 'references'
    obj: tracer.Obj
    onChange: (value: string) => void
}) => {
    const memberNames = props.obj.members
        .filter(
            member =>
                !isValueObject(member.key) &&
                (props.members === 'all' ||
                    (props.members === 'values' && !isValueObject(member.value)) ||
                    (props.members === 'references' && isValueObject(member.value)))
        )
        .map(member => getMemberName(member))

    return (
        <Item>
            <span>{props.name}</span>
            <select value={props.value} onChange={event => props.onChange(event.target.value)}>
                {props.value == undefined && <option value={undefined}>{'not selected'}</option>}
                {memberNames.map(member => (
                    <option key={member} value={member}>
                        {member}
                    </option>
                ))}
            </select>
        </Item>
    )
}

export const Parameters = (props: {
    withReset: boolean
    parameters: UnknownParameters
    obj: tracer.Obj
    onChange: (parameters: UnknownParameters) => void
}) => (
    <>
        {props.withReset && <Item onClick={() => props.onChange({})}>{'reset'}</Item>}
        {Object.entries(props.parameters).map(([name, def]) =>
            (def as any).bool ? (
                <FlagParameter
                    key={name}
                    name={name}
                    value={props.parameters[name] as boolean}
                    onChange={value => props.onChange({ ...props.parameters, [name]: value })}
                />
            ) : (def as any).range ? (
                <RangeParameter
                    key={name}
                    name={name}
                    value={props.parameters[name] as number}
                    range={(def as any).range}
                    onChange={value => props.onChange({ ...props.parameters, [name]: value })}
                />
            ) : (def as any).options ? (
                <EnumParameter
                    key={name}
                    name={name}
                    value={props.parameters[name] as string}
                    options={(def as any).options}
                    onChange={value => props.onChange({ ...props.parameters, [name]: value })}
                />
            ) : (def as any).members != undefined ? (
                <MemberParameter
                    key={name}
                    name={name}
                    value={props.parameters[name] as string | undefined}
                    members={(def as any).members}
                    obj={props.obj}
                    onChange={value => props.onChange({ ...props.parameters, [name]: value })}
                />
            ) : (
                <span>{'parameter type error'}</span>
            )
        )}
    </>
)
