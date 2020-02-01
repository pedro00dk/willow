import React from 'react'
import * as schema from '../../../schema/schema'
import { useSelection } from '../../../reducers/Store'
import { memberChanged, getDisplayValue } from '../graphview/Base'
import { colors } from '../../../colors'

const classes = {
    container: 'd-flex flex-column overflow-auto w-100',
    table: 'd-flex flex-column table table-sm table-hover border',
    row: 'd-flex',
    column: 'd-flex flex-column',
    headerCell: 'text-truncate w-100',
    cell: 'text-truncate w-50'
}

const styles = {
    changed: (changed: boolean) => (changed ? colors.yellow.lighter : undefined)
}

export const Stack = () => {
    const { stack } = useSelection(state => ({ stack: state.tracer.steps?.[state.tracer.index].snapshot?.stack ?? [] }))

    return (
        <div className={classes.container}>
            {stack.length === 0 && <Scope scope={{ line: 0, name: 'Stack', variables: [] }} />}
            {stack.map((scope, i) => (
                <Scope key={i} scope={scope} />
            ))}
        </div>
    )
}

const Scope = (props: { scope: schema.Scope }) => {
    const currentVariables = React.useRef<{ [name: string]: schema.Variable }>({})

    React.useEffect(() => {
        currentVariables.current = props.scope.variables.reduce(
            (acc, next) => ((acc[next.name] = next), acc),
            {} as { [name: string]: schema.Variable }
        )
    })

    return (
        <table className={classes.table}>
            <thead className={classes.column}>
                <tr className={classes.row}>
                    <th className={classes.headerCell}>{props.scope.name}</th>
                </tr>
            </thead>
            <tbody className={classes.column}>
                {props.scope.variables.map((variable, i) => {
                    const displayValue = getDisplayValue(undefined, variable.value)
                    const changed = memberChanged(currentVariables.current[variable.name], variable)
                    return (
                        <tr
                            key={i}
                            className={classes.row}
                            style={{ background: styles.changed(changed) }}
                            title={displayValue}
                        >
                            <td className={classes.cell}>{variable.name}</td>
                            <td className={classes.cell}>{displayValue}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}
