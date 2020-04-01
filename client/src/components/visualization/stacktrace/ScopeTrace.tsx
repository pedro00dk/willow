import { css } from 'emotion'
import React from 'react'
import { colors } from '../../../colors'
import { actions, useDispatch, useSelection } from '../../../reducers/Store'
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
    background: (selected: boolean, call: boolean, return_: boolean, exception: boolean, threw: boolean) => {
        const color = call ? colors.green : return_ ? colors.yellow : exception || threw ? colors.red : colors.blue
        return color[selected ? 'light' : 'lighter']
    },
    childWidth: (childSize: number, parentSize: number) => `${(childSize / parentSize) * 100}%`,
    childMargin: (childStart: number, previousChildEnd: number, parentSize: number) =>
        `${((childStart - previousChildEnd) / parentSize) * 100}%`
}

export const ScopeTrace = React.memo((props: { scopeSlice: ScopeSlice }) => {
    const container$ = React.useRef<HTMLDivElement>()
    const [displayMode, setDisplayMode] = React.useState<'all' | 'dim' | 'hide'>('all')
    const dispatch = useDispatch()
    const selected = useSelection(state => {
        const event = state.tracer.steps?.[state.index].snapshot?.event
        const selected = state.index >= props.scopeSlice.range[0] && state.index <= props.scopeSlice.range[1]
        const call = selected && event === 'call' && state.index === props.scopeSlice.range[0]
        const return_ = selected && event === 'return' && state.index === props.scopeSlice.range[1]
        const exception = selected && event === 'exception'
        const error = !!state.tracer.steps?.[props.scopeSlice.range[0]].error
        return [selected, call, return_, exception, error] as const
    })
    const scopeSize = props.scopeSlice.range[1] - props.scopeSlice.range[0] + 1

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
                    style={{ background: styles.background(...selected) }}
                    title={props.scopeSlice.name}
                    onClick={() => {
                        const index = props.scopeSlice.range[0]
                        dispatch(actions.index.set(index))
                        dispatch(actions.user.action({ name: 'step', payload: { index, using: 'stack trace' } }), false)
                    }}
                    onDoubleClick={() => {
                        const index = props.scopeSlice.range[1]
                        dispatch(actions.index.set(index))
                        dispatch(actions.user.action({ name: 'step', payload: { index, using: 'stack trace' } }), false)
                    }}
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
