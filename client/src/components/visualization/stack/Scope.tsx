import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../colors'
import { useDispatch, useRedux } from '../../../reducers/Store'
import { actions as tracerActions } from '../../../reducers/tracer'
import { ScopeData } from '../../../reducers/tracer'

const classes = {
    container: cn('d-flex flex-column', 'w-100'),
    scope: cn(
        'text-truncate',
        'w-100',
        css({
            fontSize: '1rem',
            backgroundClip: 'content-box !important',
            cursor: 'default',
            ':hover': { borderColor: `${colors.gray.dark} !important` }
        })
    ),
    children: cn('d-flex'),
    child: cn('d-flex')
}

const scopeColors = (depth: number) => {
    return depth <= 0
        ? colors.blue.main
        : depth <= 2
        ? colors.blue.light
        : depth <= 4
        ? colors.blue.lighter
        : depth <= 6
        ? colors.yellow.light
        : depth <= 8
        ? colors.yellow.lighter
        : depth <= 10
        ? colors.red.light
        : colors.red.lighter
}

const styles = {
    scope: (depth: number, width: number, selected: boolean, isLeaf: boolean) => ({
        background: scopeColors(depth),
        opacity: width >= 20 ? 1 : 0.5,
        border: `1px ${selected ? colors.gray.main : 'transparent'} solid`,
        height: !isLeaf ? 'auto' : '1rem'
    })
}

const computeChildWidth = (parent: ScopeData, child: ScopeData, width: number) => {
    const proportion = (child.range[1] - child.range[0] + 1) / (parent.range[1] - parent.range[0] + 1)
    return { width: proportion * width, percent: `${proportion * 100}%` }
}

export const Scope = (props: { scope: ScopeData; depth: number; width: number }) => {
    const dispatch = useDispatch()
    const { selected } = useRedux(state => ({
        selected: state.tracer.index >= props.scope.range[0] && state.tracer.index <= props.scope.range[1]
    }))
    const root = props.scope.name == undefined && !!props.scope.children
    const leaf = props.scope.name == undefined && !props.scope.children

    return (
        <div className={classes.container}>
            {!root && (
                <div
                    className={classes.scope}
                    style={styles.scope(props.depth - Number(leaf), props.width, selected, leaf)}
                    title={props.scope.name}
                    onClick={event => dispatch(tracerActions.setIndex(props.scope.range[!event.altKey ? 0 : 1]))}
                >
                    {!leaf && props.width >= 20 ? props.scope.name : '\u200b'}
                </div>
            )}
            {!leaf && props.width >= 10 && (
                <div className={classes.children}>
                    {props.scope.children.map((child, i) => {
                        const { width, percent } = computeChildWidth(props.scope, child, props.width)
                        return (
                            <div key={i} className={classes.child} style={{ width: percent }}>
                                <Scope scope={child} depth={props.depth + 1} width={width} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
