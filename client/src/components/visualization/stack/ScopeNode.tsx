import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../colors'
import { useDispatch } from '../../../reducers/Store'
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
    child: { parent: 'd-flex' }
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

export function ScopeNode(props: { scope: Scope; index: number; depth: number; width: number }) {
    const dispatch = useDispatch()
    const selected = props.index >= props.scope.steps.from && props.index <= props.scope.steps.to
    const isRoot = props.scope.children.length !== 0 && props.scope.name == undefined
    const isIntermediary = props.scope.children.length !== 0 && !isRoot
    const isLeaf = !isIntermediary

    return (
        <div className={classes.container}>
            {!isRoot && (
                <div
                    className={cn(classes.scope.base, isIntermediary ? classes.scope.intermediary : classes.scope.leaf)}
                    style={styles.scope(isIntermediary, selected, props.width, props.depth)}
                    title={props.scope.name}
                    onClick={() => dispatch(tracerActions.setIndex(props.scope.steps.from))}
                >
                    {isLeaf && props.width >= 20 ? props.scope.name : '\u200b'}
                </div>
            )}
            {isLeaf && props.width >= 5 && (
                <div className='d-flex flex-row'>
                    {props.scope.children.map((child, i) => {
                        const { width, percent } = computeChildWidth(props.scope, child, props.width)
                        return (
                            <div key={i} className={classes.child.parent} style={{ width: percent }}>
                                <ScopeNode scope={child} index={props.index} depth={props.depth + 1} width={width} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
