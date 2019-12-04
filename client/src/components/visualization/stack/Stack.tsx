import React from 'react'
import * as schema from '../../../schema/schema'
import { useSelection } from '../../../reducers/Store'
import { memberChanged, getDisplayValue } from '../graphview/Base'
import { colors } from '../../../colors'

const classes = {
    container: 'd-flex flex-column w-100 h-100',
    table: 'table table-sm table-hover table-striped table-bordered w-100',
    header: 'thread-light w-100',
    body: 'w-100',
    headerRow: 'w-100',
    bodyRow: 'w-100',
    nameCell: 'd-inline-block text-nowrap text-truncate w-25',
    valueCell: 'd-inline-block text-nowrap text-truncate w-75'
}

const styles = {
    changed: (changed: boolean) => (changed ? colors.red.lighter : undefined)
}

// TODO refactor css classes
export const Stack = () => {
    const { tracer } = useSelection(state => ({ tracer: state.tracer }))

    return (
        <div className={classes.container}>
            {(tracer.steps?.[tracer.index].snapshot?.stack ?? []).map(scope => (
                <Scope scope={scope} />
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
            <thead className={classes.header}>
                <tr className={classes.headerRow} title={props.scope.name}>
                    <th className={classes.nameCell} scope='col'>
                        {props.scope.name}
                    </th>
                    <th className={classes.valueCell} scope='col'>
                        value
                    </th>
                </tr>
            </thead>
            <tbody className={classes.body}>
                {props.scope.variables.map(variable => {
                    const changed = memberChanged(currentVariables.current[variable.name], variable)
                    const displayValue = getDisplayValue(undefined, variable.value)
                    return (
                        <tr
                            className={classes.bodyRow}
                            style={{ background: styles.changed(changed) }}
                            title={displayValue}
                        >
                            <td className={classes.nameCell}>{variable.name}</td>
                            <td className={classes.valueCell}>{displayValue}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}
