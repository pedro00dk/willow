import { css } from 'emotion'
import React from 'react'
import { colors } from '../../../colors'
import { useDispatch, useSelection } from '../../../reducers/Store'
import { actions as tracerActions } from '../../../reducers/tracer/tracer'
import { ScopeSlice } from './StackTrace'

const classes = {
    container: 'd-flex flex-column w-100',
    scope: `text-truncate w-100' ${css({
        backgroundClip: 'content-box !important',
        border: '1px solid transparent',
        cursor: 'default',
        fontSize: '1rem',
        ':hover': { borderColor: colors.gray.dark }
    })}`,
    children: 'd-flex',
    child: 'd-flex'
}

const styles = {
    background: (selected: boolean, threw: boolean) =>
        selected ? (threw ? colors.red.light : colors.blue.light) : threw ? colors.red.lighter : colors.blue.lighter,
    childWidth: (childSize: number, parentSize: number) => `${(childSize / parentSize) * 100}%`,
    childMargin: (childStart: number, previousChildEnd: number, parentSize: number) =>
        `${((childStart - previousChildEnd) / parentSize) * 100}%`
}

export const ScopeTrace = React.memo((props: { scopeSlice: ScopeSlice }) => {
    const container$ = React.useRef<HTMLDivElement>()
    const [displayMode, setDisplayMode] = React.useState<'all' | 'dim' | 'hide'>('all')
    const dispatch = useDispatch()
    const selected = useSelection(
        state => state.tracer.index >= props.scopeSlice.range[0] && state.tracer.index <= props.scopeSlice.range[1]
    )
    const scopeSize = props.scopeSlice.range[1] - props.scopeSlice.range[0] + 1
    const error = props.scopeSlice.scopes[props.scopeSlice.scopes.length - 1]?.line === -1

    const childrenScopeSlices = React.useMemo(() => {
        return props.scopeSlice.children.reduce((acc, childStackSlice, i) => {
            if (childStackSlice.length === 0) return acc
            let scopeSlice = acc[acc.length - 1]
            const [firstScope, ...remainingScopes] = childStackSlice
            if (
                !scopeSlice ||
                scopeSlice.name !== firstScope.name ||
                scopeSlice.range[1] + 1 < props.scopeSlice.range[0] + i
            ) {
                const range: [number, number] = [props.scopeSlice.range[0] + i, props.scopeSlice.range[0] + i]
                scopeSlice = { name: firstScope.name, range, scopes: [], children: [] }
                acc.push(scopeSlice)
            }
            scopeSlice.range[1] = props.scopeSlice.range[0] + i
            scopeSlice.scopes.push(firstScope)
            scopeSlice.children.push(remainingScopes)
            return acc
        }, [] as ScopeSlice[])
    }, [props.scopeSlice])

    React.useLayoutEffect(() => {
        const onResize = () => {
            const width = container$.current.clientWidth
            const newDisplayMode = width >= 40 ? 'all' : width >= 5 ? 'dim' : 'hide'
            if (displayMode !== newDisplayMode) setDisplayMode(newDisplayMode)
        }

        onResize()
        addEventListener('paneResizeEnd', onResize)
        return () => removeEventListener('paneResizeEnd', onResize)
    }, [displayMode])

    return (
        <div ref={container$} className={classes.container}>
            {props.scopeSlice.scopes.length !== 0 && displayMode !== 'hide' && (
                <div
                    className={classes.scope}
                    style={{ background: styles.background(selected, error) }}
                    title={props.scopeSlice.name}
                    onClick={event => dispatch(tracerActions.setIndex(props.scopeSlice.range[!event.altKey ? 0 : 1]))}
                >
                    {displayMode === 'all' ? props.scopeSlice.name : '\u200b'}
                </div>
            )}
            <div className={classes.children}>
                {childrenScopeSlices.map((child, i) => {
                    const previousChild = childrenScopeSlices[i - 1]
                    const previousChildEnd = previousChild?.range[1] + 1 || props.scopeSlice.range[0]
                    const width = styles.childWidth(child.range[1] - child.range[0] + 1, scopeSize)
                    const marginLeft = styles.childMargin(child.range[0], previousChildEnd, scopeSize)
                    return (
                        <div key={i} className={classes.child} style={{ width, marginLeft }}>
                            <ScopeTrace scopeSlice={child} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
})
