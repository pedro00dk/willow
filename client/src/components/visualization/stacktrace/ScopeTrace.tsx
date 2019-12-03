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
            fontSize: '1rem',
            backgroundClip: 'content-box !important',
            cursor: 'default',
            ':hover': { borderColor: `${colors.gray.dark} !important` }
        })
    ),
    children: 'd-flex',
    child: 'd-flex'
}

const styles = {
    scope: (width: number, selected: boolean, threw: boolean) => ({
        opacity: width >= 20 ? 1 : 0.5,
        border: `1px ${selected ? colors.gray.main : 'transparent'} solid`,
        background: !threw ? colors.blue.light : colors.red.light
    })
}

export const ScopeTrace = React.memo((props: { scopeSlice: ScopeSlice; width: number }) => {
    const dispatch = useDispatch()
    const { selected } = useSelection(state => ({
        selected: state.tracer.index >= props.scopeSlice.range[0] && state.tracer.index <= props.scopeSlice.range[1]
    }))
    const scopeSliceSize = props.scopeSlice.range[1] - props.scopeSlice.range[0] + 1
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

    return (
        <div className={classes.container}>
            {props.scopeSlice.name != undefined && (
                <div
                    className={classes.scope}
                    style={styles.scope(props.width, selected, threw)}
                    title={props.scopeSlice.name}
                    onClick={event => dispatch(tracerActions.setIndex(props.scopeSlice.range[!event.altKey ? 0 : 1]))}
                >
                    {props.width >= 20 ? props.scopeSlice.name : '\u200b'}
                </div>
            )}
            {props.width >= 10 && (
                <div className={classes.children}>
                    {childrenScopeSlices.map((child, i) => {
                        const childSize = child.range[1] - child.range[0] + 1
                        const childWidthProportion = childSize / scopeSliceSize
                        const childWidthPercent = `${childWidthProportion * 100}%`
                        const childWidthPixels = childWidthProportion * props.width
                        const previousChild = childrenScopeSlices[i - 1]
                        const childMarginSize =
                            child.range[0] - (previousChild?.range[1] + 1 || props.scopeSlice.range[0])
                        const childMarginProportion = childMarginSize / scopeSliceSize
                        const childMarginPercent = `${childMarginProportion * 100}%`
                        return (
                            <div
                                key={i}
                                className={classes.child}
                                style={{ width: childWidthPercent, marginLeft: childMarginPercent }}
                            >
                                <ScopeTrace scopeSlice={child} width={childWidthPixels} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
})
