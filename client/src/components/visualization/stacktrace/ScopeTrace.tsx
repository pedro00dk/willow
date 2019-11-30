import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import { colors } from '../../../colors'
import { useDispatch, useSelection } from '../../../reducers/Store'
import { actions as tracerActions } from '../../../reducers/tracer'
import { ScopeData } from './StackTrace'

const classes = {
    container: 'd-flex flex-column w-100',
    scope: cn(
        'text-truncate w-100',
        css({
            fontSize: '1rem',
            background: colors.blue.light,
            backgroundClip: 'content-box !important',
            cursor: 'default',
            ':hover': { borderColor: `${colors.gray.dark} !important` }
        })
    ),
    children: 'd-flex',
    child: 'd-flex'
}

const styles = {
    scope: (width: number, selected: boolean) => ({
        opacity: width >= 20 ? 1 : 0.5,
        border: `1px ${selected ? colors.gray.main : 'transparent'} solid`
    })
}

export const ScopeTrace = (props: { scope: ScopeData; width: number }) => {
    const dispatch = useDispatch()
    const { selected } = useSelection(state => ({
        selected: state.tracer.index >= props.scope.start && state.tracer.index < props.scope.start + props.scope.size
    }))

    return (
        <div className={classes.container}>
            {props.scope.name == undefined && (
                <div
                    className={classes.scope}
                    style={styles.scope(props.width, selected)}
                    title={props.scope.name}
                    onClick={event =>
                        dispatch(tracerActions.setIndex(props.scope.start + (event.altKey && props.scope.size - 1)))
                    }
                >
                    {props.width >= 20 ? props.scope.name : '\u200b'}
                </div>
            )}
            {props.width >= 10 && (
                <div className={classes.children}>
                    {props.scope.children.map((child, i) => {
                        const childWidthProportion = child.size / props.scope.size
                        const childWidthPercent = `${childWidthProportion * 100}%`
                        const childWidthPixels = childWidthProportion * props.width
                        const previousChild = props.scope.children[i - 1]
                        const childMarginSize =
                            child.start - ((previousChild?.start ?? 0) + (previousChild?.size ?? 0)) - props.scope.start
                        const childMarginProportion = childMarginSize / props.scope.size
                        const childMarginPercent = `${childMarginProportion * 100}%`

                        return (
                            <div
                                key={i}
                                className={classes.child}
                                style={{ width: childWidthPercent, marginLeft: childMarginPercent }}
                            >
                                <ScopeTrace scope={child} width={childWidthPixels} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
