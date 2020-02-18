import React from 'react'
import { Item } from 'react-contexify'
import { ComputedParameters, DefaultParameters, readParameters, UnknownParameters } from '../GraphData'

const BooleanParameter = (props: { name: string; value: boolean; onChange: (value: boolean) => void }) => (
    <Item>
        <span>{props.name}</span>
        <input type='checkbox' checked={props.value} onChange={event => props.onChange(event.target.checked)} />
    </Item>
)

const NumberParameter = (props: {
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

const StringParameter = (props: {
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

export const Parameters = <T extends UnknownParameters, U extends DefaultParameters>(props: {
    withReset: boolean
    parameters: T
    defaults: U
    onChange: (parameters: ComputedParameters<U>) => void
}) => {
    const parameters = readParameters(props.parameters, props.defaults)
    return (
        <>
            {props.withReset && (
                <Item onClick={args => props.onChange(readParameters(undefined, props.defaults))}>
                    <span>{'reset'}</span>
                </Item>
            )}
            {Object.entries(parameters).map(([name, value]) =>
                typeof value === 'boolean' ? (
                    <BooleanParameter
                        key={name}
                        name={name}
                        value={value}
                        onChange={value => props.onChange({ ...parameters, [name]: value })}
                    />
                ) : typeof value === 'number' ? (
                    <NumberParameter
                        key={name}
                        name={name}
                        value={value}
                        range={(props.defaults[name] as any)['range']}
                        onChange={value => props.onChange({ ...parameters, [name]: value })}
                    />
                ) : typeof value === 'string' ? (
                    <StringParameter
                        key={name}
                        name={name}
                        value={value}
                        options={(props.defaults[name] as any)['options']}
                        onChange={value => props.onChange({ ...parameters, [name]: value })}
                    />
                ) : (
                    <span>{'unknown  parameter type'}</span>
                )
            )}
        </>
    )
}
