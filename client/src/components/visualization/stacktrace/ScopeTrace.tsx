import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import { colors } from '../../../colors'
import { useDispatch, useSelection } from '../../../reducers/Store'
import { actions as tracerActions } from '../../../reducers/tracer'
import { ScopeSlice } from './StackTrace'

const classes = {
    container: 'd-flex flex-column w-100',
    scope: cn(
        'text-truncate w-100',
        css({
            backgroundClip: 'content-box !important',
            border: '1px solid transparent',
            cursor: 'default',
            fontSize: '1rem',
            ':hover': { borderColor: colors.gray.dark }
        })
    ),
    children: 'd-flex',
    child: 'd-flex'
}

const styles = {
    scope: (selected: boolean, threw: boolean) => ({
        background: selected
            ? !threw
                ? colors.blue.light
                : colors.red.light
            : !threw
            ? colors.blue.lighter
            : colors.red.lighter
    })
}

export const ScopeTrace = React.memo((props: { scopeSlice: ScopeSlice }) => {
    const container$ = React.useRef<HTMLDivElement>()
    const [displayMode, setDisplayMode] = React.useState<'all' | 'dim' | 'hide'>()
    const dispatch = useDispatch()
    const selected = useSelection(
        state => state.tracer.index >= props.scopeSlice.range[0] && state.tracer.index <= props.scopeSlice.range[1]
    )
    const scopeSize = props.scopeSlice.range[1] - props.scopeSlice.range[0] + 1
    const threw = props.scopeSlice.nodes[props.scopeSlice.nodes.length - 1]?.line == undefined ?? false

    const childrenScopeSlices = React.useMemo(() => {
        return props.scopeSlice.children.reduce((acc, [first, ...others], i) => {
            if (!first) return acc
            if (
                acc.length === 0 ||
                acc[acc.length - 1].name !== first.name ||
                acc[acc.length - 1].range[1] + 1 < props.scopeSlice.range[0] + i
            )
                acc.push({
                    name: first.name,
                    range: [props.scopeSlice.range[0] + i, props.scopeSlice.range[0] + i],
                    nodes: [],
                    children: []
                })
            const scopeSlice = acc[acc.length - 1]
            scopeSlice.range[1] = props.scopeSlice.range[0] + i
            scopeSlice.nodes.push(first)
            scopeSlice.children.push(others)
            return acc
        }, [] as ScopeSlice[])
    }, [props.scopeSlice])

    React.useLayoutEffect(() => {
        const onResize = (event?: UIEvent) => {
            const width = container$.current.clientWidth
            const newDisplayMode = width >= 40 ? 'all' : width >= 10 ? 'dim' : 'hide'
            displayMode !== newDisplayMode && setDisplayMode(newDisplayMode)
        }

        displayMode ?? onResize()
        globalThis.addEventListener('resize', onResize)
        return () => globalThis.removeEventListener('resize', onResize)
    }, [displayMode])

    return (
        <div ref={container$} className={classes.container}>
            {props.scopeSlice.name != undefined && (
                <div
                    className={classes.scope}
                    style={styles.scope(selected, threw)}
                    title={props.scopeSlice.name}
                    onClick={event => dispatch(tracerActions.setIndex(props.scopeSlice.range[!event.altKey ? 0 : 1]))}
                >
                    {displayMode === 'all' ? props.scopeSlice.name : '\u200b'}
                </div>
            )}
            {displayMode !== 'hide' && (
                <div className={classes.children}>
                    {childrenScopeSlices.map((child, i) => {
                        const childSize = child.range[1] - child.range[0] + 1
                        const widthRatio = childSize / scopeSize
                        const width = `${widthRatio * 100}%`
                        const previousChild = childrenScopeSlices[i - 1]
                        const marginSize = child.range[0] - (previousChild?.range[1] + 1 || props.scopeSlice.range[0])
                        const marginRatio = marginSize / scopeSize
                        const marginLeft = `${marginRatio * 100}%`
                        return (
                            <div key={i} className={classes.child} style={{ width, marginLeft }}>
                                <ScopeTrace scopeSlice={child} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
})
