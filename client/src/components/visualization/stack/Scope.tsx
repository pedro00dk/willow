import { css } from 'emotion'
import React from 'react'
import { colors } from '../../../colors'
import * as tracer from '../../../types/tracer'
import { getValueDisplay, getValueString, isSameMember } from '../graphview/TracerUtils'

const classes = {
    container: 'd-flex flex-column table table-sm table-hover border',
    column: 'd-flex flex-column',
    row: 'd-flex',
    headerCell: `text-truncate w-100 ${css({ fontSize: '1rem' })}`,
    cell: `text-truncate w-50 ${css({ fontSize: '1rem' })}`
}

const styles = {
    cellColor: (changed: boolean) => changed && colors.yellow.lighter
}

export const Scope = (props: { scope: tracer.Scope }) => {
    const previousMembers = React.useRef<{ [name: string]: tracer.Member }>({})

    React.useEffect(() => {
        previousMembers.current = Object.fromEntries(
            props.scope.members.map(member => [getValueString(member.key), member])
        )
    }, [props.scope])

    return (
        <table className={classes.container}>
            <thead className={classes.column}>
                <tr className={classes.row}>
                    <th className={classes.headerCell}>{props.scope.name}</th>
                </tr>
            </thead>
            <tbody className={classes.column}>
                {props.scope.members.map((member, i) => {
                    const key = getValueString(member.key)
                    const changed = !isSameMember(member, previousMembers.current[key])
                    const displayKey = getValueDisplay(member.key)
                    const displayValue = getValueDisplay(member.value)
                    return (
                        <tr
                            key={i}
                            className={classes.row}
                            style={{ background: styles.cellColor(changed) }}
                            title={displayValue}
                        >
                            <td className={classes.cell}>{displayKey}</td>
                            <td className={classes.cell}>{displayValue}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}
