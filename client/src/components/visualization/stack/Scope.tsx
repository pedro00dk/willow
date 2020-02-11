import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import * as schema from '../../../schema/schema'
import { getDisplayValue, isSameVariable } from '../graphview/SchemaUtils'
import { colors } from '../../../colors'

const classes = {
    container: 'd-flex flex-column table table-sm table-hover border',
    column: 'd-flex flex-column',
    row: 'd-flex',
    headerCell: cn('text-truncate w-100', css({ fontSize: '1rem' })),
    cell: cn('text-truncate w-50', css({ fontSize: '1rem' }))
}

const styles = {
    background: (changed: boolean) => (changed ? colors.yellow.lighter : undefined)
}

export const Scope = (props: { scope: schema.Scope }) => {
    const currentVariables = React.useRef<{ [name: string]: schema.Variable }>({})

    React.useEffect(() => {
        currentVariables.current = props.scope.variables.reduce((acc, variable) => {
            acc[variable.name] = variable
            return acc
        }, {} as { [name: string]: schema.Variable })
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
                    const changed = !isSameVariable(variable, currentVariables.current[variable.name])
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
