import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import { colors } from '../../../colors'
import { useDispatch, useSelection } from '../../../reducers/Store'
import { actions as tracerActions } from '../../../reducers/tracer'
import { ScopeData } from './StackTrace'
import * as schema from '../../../schema/schema'

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
    scope: (depth: number, width: number, selected: boolean) => ({
        background: scopeColors(depth),
        opacity: width >= 20 ? 1 : 0.5,
        border: `1px ${selected ? colors.gray.main : 'transparent'} solid`
    })
}

export const ScopeTrace = (props: { scope: ScopeData; depth: number; width: number }) => {
    if (props.depth === 0) console.log(props.width)
    const dispatch = useDispatch()
    const { selected } = useSelection(state => ({
        selected: state.tracer.index >= props.scope.range[0] && state.tracer.index <= props.scope.range[1]
    }))
    const root = props.scope.name == undefined && !!props.scope.children

    return (
        <div className={classes.container}>
            {!root && (
                <div
                    className={classes.scope}
                    style={styles.scope(props.depth, props.width, selected)}
                    title={props.scope.name}
                    onClick={event => dispatch(tracerActions.setIndex(props.scope.range[!event.altKey ? 0 : 1]))}
                >
                    {props.width >= 20 ? props.scope.name : '\u200b'}
                </div>
            )}
            {props.width >= 10 && (
                <div className={classes.children}>
                    {props.scope.children.map((child, i) => {
                        const proportion =
                            (child.range[1] - child.range[0] + 1) / (props.scope.range[1] - props.scope.range[0] + 1)
                        const pixels = proportion * props.width
                        const percent = `${proportion * 100}%`

                        return (
                            <div key={i} className={classes.child} style={{ width: percent }}>
                                <ScopeTrace scope={child} depth={props.depth + 1} width={pixels} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
