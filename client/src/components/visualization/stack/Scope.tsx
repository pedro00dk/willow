import { css } from 'emotion'
import React from 'react'
import { colors } from '../../../colors'
import * as tracer from '../../../types/tracer'
import { getDisplayValue, getMemberName, isSameMember } from '../graphview/TracerUtils'

const classes = {
    container: 'd-flex flex-column table table-sm table-hover border',
    column: 'd-flex flex-column',
    row: 'd-flex',
    headerCell: `text-truncate w-100 ${css({ fontSize: '1rem' })}`,
    cell: `text-truncate w-50 ${css({ fontSize: '1rem' })}`
}

const styles = {
    background: (changed: boolean) => changed && colors.yellow.lighter
}

export const Scope = (props: { scope: tracer.Scope }) => {
    const previousScope = React.useRef<tracer.Scope>()
    const previousMembers = React.useRef<{ [name: string]: tracer.Member }>({})
    if (props.scope !== previousScope.current) {
        const membersEntries = previousScope.current?.members.map(member => [getMemberName(member), member]) ?? []
        previousMembers.current = Object.fromEntries(membersEntries)
    }
    previousScope.current = props.scope

    return (
        <table className={classes.container}>
            <thead className={classes.column}>
                <tr className={classes.row}>
                    <th className={classes.headerCell}>{props.scope.name}</th>
                </tr>
            </thead>
            <tbody className={classes.column}>
                {props.scope.members.map((member, i) => {
                    const changed = !isSameMember(member, previousMembers.current[getMemberName(member)])
                    const displayKey = getDisplayValue(member.key)
                    const displayValue = getDisplayValue(member.value)
                    return (
                        <tr
                            key={i}
                            className={classes.row}
                            style={{ background: styles.background(changed) }}
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
