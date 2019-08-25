import * as React from 'react'
import { Item } from 'react-contexify'

export type DefaultParameters = {
    [name: string]:
        | { value: boolean }
        | { value: number; range: [number, number] }
        | { value: string; options: string[] }
}
export type UnknownParameters = { [name: string]: DefaultParameters[keyof DefaultParameters]['value'] }
export type ComputedParameters<T extends DefaultParameters> = { [name in keyof T]: T[name]['value'] }

export const readParameters = <T extends UnknownParameters, U extends DefaultParameters>(parameters: T, defaults: U) =>
    Object.fromEntries(
        Object.entries(defaults).map(([name, defaults]) => {
            if (!parameters) return [name, defaults.value] as const
            const value = parameters[name]
            if (typeof value !== typeof defaults.value) return [name, defaults.value] as const
            return [name, value] as const
        })
    ) as ComputedParameters<U>

export const BooleanParameter = (props: { name: string; value: boolean; onChange: (value: boolean) => void }) => (
    <Item>
        <span>{props.name}</span>
        <input type='checkbox' checked={props.value} onChange={event => props.onChange(event.target.checked)} />
    </Item>
)

export const NumberParameter = (props: {
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

export const StringParameter = (props: {
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
    onChange: (updatedParameters: ComputedParameters<U>) => void
}) => {
    const parameters = readParameters(props.parameters, props.defaults)
    return (
        <>
            {props.withReset && (
                <Item onClick={args => props.onChange(readParameters(undefined, props.defaults))}>
                    <span>reset</span>
                </Item>
            )}
            {Object.entries(parameters).map(([name, value]) =>
                typeof value === 'boolean' ? (
                    <BooleanParameter
                        name={name}
                        value={value}
                        onChange={value => {
                            props.onChange({ ...parameters, [name]: value })
                        }}
                    />
                ) : typeof value === 'number' ? (
                    <NumberParameter
                        name={name}
                        value={value}
                        range={(props.defaults[name] as any)['range']}
                        onChange={value => {
                            props.onChange({ ...parameters, [name]: value })
                        }}
                    />
                ) : typeof value === 'string' ? (
                    <StringParameter
                        name={name}
                        value={value}
                        options={(props.defaults[name] as any)['options']}
                        onChange={value => {
                            props.onChange({ ...parameters, [name]: value })
                        }}
                    />
                ) : (
                    <span>unknown property</span>
                )
            )}
        </>
    )
}
