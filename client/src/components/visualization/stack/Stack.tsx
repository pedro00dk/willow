import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import * as schema from '../../../schema/schema'
import { useSelection } from '../../../reducers/Store'
import { memberChanged, getDisplayValue } from '../graphview/Base'
import { colors } from '../../../colors'

const classes = {
    container: 'd-flex flex-column position-absolute overflow-auto',
    table: 'd-flex flex-column table table-sm table-hover border',
    row: 'd-flex',
    column: 'd-flex flex-column',
    headerCell: cn('text-truncate w-100', css({ fontSize: '1rem' })),
    cell: cn('text-truncate w-50', css({ fontSize: '1rem' }))
}

const styles = {
    variable: (changed: boolean) => (changed ? colors.yellow.lighter : undefined)
}

export const Stack = () => {
    const container$ = React.useRef<HTMLDivElement>()
    const { stack } = useSelection(state => ({ stack: state.tracer.steps?.[state.tracer.index].snapshot?.stack }))

    React.useLayoutEffect(() => {
        const onResize = (event: Event) => {
            const parentSize = {
                width: container$.current.parentElement.clientWidth,
                height: container$.current.parentElement.clientHeight
            }
            const size = {
                width: container$.current.clientWidth,
                height: container$.current.clientHeight
            }
            if (size.width === parentSize.width && size.height === parentSize.height) return
            container$.current.style.width = `${parentSize.width - 1}px`
            container$.current.style.height = `${parentSize.height - 1}px`
        }

        onResize(undefined)
        globalThis.addEventListener('paneResize', onResize)
        return () => globalThis.removeEventListener('paneResize', onResize)
    }, [container$])

    React.useEffect(() => container$.current.scrollBy({ top: Number.MAX_SAFE_INTEGER, behavior: 'smooth' }))

    return (
        <div ref={container$} className={classes.container}>
            {!stack && <Scope scope={{ line: 0, name: 'Stack', variables: [] }} />}
            {(stack ?? []).map((scope, i) => (
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
                            style={{ background: styles.variable(changed) }}
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
