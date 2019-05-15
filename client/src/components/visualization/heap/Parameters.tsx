import * as React from 'react'
import { Item } from 'react-contexify'

export function BooleanParameter(props: { name: string; value: boolean; onChange: (value: boolean) => void }) {
    return (
        <Item>
            <span>{props.name}</span>
            <input type='checkbox' checked={props.value} onChange={event => props.onChange(event.target.checked)} />
        </Item>
    )
}

export function RangeParameter(props: {
    name: string
    value: number
    interval: { min: number; max: number }
    onChange: (value: number) => void
}) {
    return (
        <Item>
            <span>{props.name}</span>
            <input
                type='range'
                value={props.value}
                min={props.interval.min}
                max={props.interval.max}
                onChange={event => props.onChange(event.target.valueAsNumber)}
            />
        </Item>
    )
}

export function SelectParameter(props: {
    name: string
    value: string
    options: string[]
    onChange: (value: string) => void
}) {
    return (
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
}
