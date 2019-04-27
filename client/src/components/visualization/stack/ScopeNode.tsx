import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../colors'
import { useDispatch, useRedux } from '../../../reducers/Store'
import { actions as tracerActions } from '../../../reducers/tracer'
import { Scope } from '../../../reducers/visualization'

const classes = {
    container: cn('d-flex flex-column', 'w-100'),
    scope: {
        base: cn(
            'text-truncate',
            'w-100',
            css({
                fontSize: '0.75rem',
                border: '0.5px transparent solid',
                backgroundClip: 'content-box !important',
                cursor: 'default'
            })
        ),
        intermediary: cn(css({ ':hover': { borderColor: `${colors.gray.dark} !important` } })),
        leaf: cn(
            css({
                ':hover': {
                    background: `radial-gradient(ellipse at top, ${colors.primaryBlue.light} 50%, transparent 60%)`
                }
            })
        )
    },
    children: cn('d-flex flex-row'),
    child: cn('d-flex')
}

const styles = {
    scope: (isIntermediary: boolean, selected: boolean, width: number, depth: number) => ({
        ...(isIntermediary
            ? {
                  backgroundColor:
                      depth <= 1
                          ? colors.primaryBlue.main
                          : depth <= 4
                          ? colors.primaryBlue.light
                          : depth <= 7
                          ? colors.secondaryYellow.light
                          : depth <= 10
                          ? colors.secondaryYellow.lighter
                          : depth <= 13
                          ? colors.secondaryRed.light
                          : colors.secondaryRed.lighter
              }
            : {
                  background: `radial-gradient(ellipse at top, ${colors.primaryBlue.lighter} 20%, transparent 30%)`
              }),
        ...(selected && isIntermediary ? { borderColor: colors.gray.light } : undefined),
        ...(selected && !isIntermediary
            ? {
                  background: `radial-gradient(ellipse at top, ${colors.primaryBlue.main} 50%, transparent 60%)`
              }
            : undefined),
        opacity: width >= 20 ? 1 : width >= 10 ? 0.75 : 0.5
    })
}

const computeChildWidth = (parent: Scope, child: Scope, width: number) => {
    const proportion = (child.steps.to - child.steps.from + 1) / (parent.steps.to - parent.steps.from + 1)
    return { width: proportion * width, percent: `${proportion * 100}%` }
}

// tslint:disable-next-line: variable-name
export const MemoScopeNode = React.memo(ScopeNode)
export function ScopeNode(props: { scope: Scope; depth: number; width: number }) {
    const dispatch = useDispatch()
    const { selected } = useRedux(state => ({
        selected: state.tracer.index >= props.scope.steps.from && state.tracer.index <= props.scope.steps.to
    }))
    const isRoot = props.scope.children.length !== 0 && props.scope.name == undefined
    const isIntermediary = props.scope.children.length !== 0 && !isRoot

    return (
        <div className={classes.container}>
            {!isRoot && (
                <div
                    className={cn(classes.scope.base, isIntermediary ? classes.scope.intermediary : classes.scope.leaf)}
                    style={styles.scope(isIntermediary, selected, props.width, props.depth)}
                    title={props.scope.name}
                    onClick={() => dispatch(tracerActions.setIndex(props.scope.steps.from))}
                >
                    {isIntermediary && props.width >= 20 ? props.scope.name : '\u200b'}
                </div>
            )}
            {(isRoot || isIntermediary) && props.width >= 5 && (
                <div className={classes.children}>
                    {props.scope.children.map((child, i) => {
                        const { width, percent } = computeChildWidth(props.scope, child, props.width)
                        return (
                            <div key={i} className={classes.child} style={{ width: percent }}>
                                <MemoScopeNode scope={child} depth={props.depth + 1} width={width} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
