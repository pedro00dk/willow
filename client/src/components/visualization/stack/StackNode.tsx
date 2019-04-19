import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../../colors'
import { actions as debugIndexerActions } from '../../../reducers/debug/indexer'
import { StackNode } from '../../../reducers/debug/stack'
import { useDispatch } from '../../../reducers/Store'

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
        node: cn(css({ ':hover': { borderColor: `${colors.gray.dark} !important` } })),
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
    scope: (isNode: boolean, selected: boolean, width: number, depth: number) => ({
        ...(isNode
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
        ...(selected && isNode ? { borderColor: colors.gray.light } : undefined),
        ...(selected && !isNode
            ? {
                  background: `radial-gradient(ellipse at top, ${colors.primaryBlue.main} 50%, transparent 60%)`
              }
            : undefined),
        opacity: width >= 20 ? 1 : width >= 10 ? 0.75 : 0.5
    })
}

export function StackNode(props: { node: StackNode; indexer: number; depth: number; width: number }) {
    const dispatch = useDispatch()
    const selected = props.indexer >= props.node.steps.from && props.indexer <= props.node.steps.to
    const isNode = props.node.children.length !== 0
    const isRoot = isNode && props.node.name == undefined

    const computeChildWidth = (child: StackNode) => {
        const proportion = (child.steps.to - child.steps.from + 1) / (props.node.steps.to - props.node.steps.from + 1)
        return { width: proportion * props.width, percent: `${proportion * 100}%` }
    }

    return (
        <div className={classes.container}>
            {!isRoot && (
                <div
                    className={cn(classes.scope.base, isNode ? classes.scope.node : classes.scope.leaf)}
                    style={styles.scope(isNode, selected, props.width, props.depth)}
                    title={props.node.name}
                    onClick={() => dispatch(debugIndexerActions.set(props.node.steps.from))}
                >
                    {isNode && props.width >= 20 ? props.node.name : '\u200b'}
                </div>
            )}
            {isNode && props.width >= 5 && (
                <div className='d-flex flex-row'>
                    {props.node.children.map((child, i) => {
                        const { width, percent } = computeChildWidth(child)
                        return (
                            <div key={i} className={classes.child.parent} style={{ width: percent }}>
                                <StackNode node={child} indexer={props.indexer} depth={props.depth + 1} width={width} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
