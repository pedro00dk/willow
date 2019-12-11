import React from 'react'
import * as schema from '../../../schema/schema'
import { useSelection } from '../../../reducers/Store'
import { memberChanged, getDisplayValue } from '../graphview/Base'
import { colors } from '../../../colors'

const classes = {
    container: 'd-flex flex-column position-absolute flex-nowrap overflow-auto',
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

export const Stack = () => {
    const ref = React.useRef<HTMLDivElement>()
    const [size, setSize] = React.useState({ x: 0, y: 0 })
    const { tracer } = useSelection(state => ({ tracer: state.tracer }))

    React.useEffect(() => {
        const interval = setInterval(() => {
            const parentSize = { x: ref.current.parentElement.clientWidth, y: ref.current.parentElement.clientHeight }
            if (size.x === parentSize.x && size.y === parentSize.y) return
            setSize(parentSize)
        }, 1000)

        return () => clearInterval(interval)
    }, [ref.current, size])

    return (
        <div ref={ref} className={classes.container} style={{ width: size.x - 1, height: size.y - 1 }}>
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
