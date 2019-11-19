import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import { colors } from '../../../colors'
import { useDispatch, useSelection } from '../../../reducers/Store'
import { actions as tracerActions } from '../../../reducers/tracer'
import { ScopeData } from '../../../reducers/tracer'

const classes = {
    container: 'd-flex flex-column w-100',
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
    children: 'd-flex',
    child: 'd-flex'
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

export const ScopeTrace = (props: { scope: ScopeData; depth: number; width: number }) => {
    const dispatch = useDispatch()
    const { selected } = useSelection(state => ({
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
                        const proportion =
                            (child.range[1] - child.range[0] + 1) / (props.scope.range[1] - props.scope.range[0] + 1)
                        const width = proportion * props.width
                        const percent = `${proportion * 100}%`

                        return (
                            <div key={i} className={classes.child} style={{ width: percent }}>
                                <ScopeTrace scope={child} depth={props.depth + 1} width={width} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
