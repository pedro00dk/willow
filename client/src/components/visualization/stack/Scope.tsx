import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import { colors } from '../../../colors'
import * as schema from '../../../schema/schema'
import { getDisplayValue, isSameVariable } from '../graphview/SchemaUtils'

const classes = {
    container: 'd-flex flex-column table table-sm table-hover border',
    column: 'd-flex flex-column',
    row: 'd-flex',
    headerCell: cn('text-truncate w-100', css({ fontSize: '1rem' })),
    cell: cn('text-truncate w-50', css({ fontSize: '1rem' }))
}

const styles = {
    background: (changed: boolean) => changed && colors.yellow.lighter
}

export const Scope = (props: { scope: schema.Scope }) => {
    const previousVariables = React.useRef<{ [name: string]: schema.Variable }>({})

    React.useEffect(() => {
        previousVariables.current = Object.fromEntries(props.scope.variables.map(variable => [variable.name, variable]))
    })

    return (
        <table className={classes.container}>
            <thead className={classes.column}>
                <tr className={classes.row}>
                    <th className={classes.headerCell}>{props.scope.name}</th>
                </tr>
            </thead>
            <tbody className={classes.column}>
                {props.scope.variables.map((variable, i) => {
                    const changed = !isSameVariable(variable, previousVariables.current[variable.name])
                    const displayValue = getDisplayValue(variable.value)
                    return (
                        <tr
                            key={i}
                            className={classes.row}
                            style={{ background: styles.background(changed) }}
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
