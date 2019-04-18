import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../colors'
import * as protocol from '../../protobuf/protocol'
import { actions as debugIndexerActions } from '../../reducers/debug/indexer'
import { StackNode } from '../../reducers/debug/stack'
import { useDispatch, useRedux } from '../../reducers/Store'

const classes = {
    stack: { container: 'd-flex flex-row align-items-start flex-nowrap overflow-auto w-100' },
    node: {
        container: 'd-flex flex-column w-100',
        scope: {
            base: cn(
                'text-truncate w-100',
                css({
                    fontSize: '0.75rem',
                    border: '0.5px transparent solid',
                    backgroundClip: 'content-box !important',
                    cursor: 'default'
                })
            ),
            node: css({ ':hover': { borderColor: `${colors.gray.primary} !important` } }),
            leaf: css({
                ':hover': {
                    background: `radial-gradient(ellipse at top, ${colors.highlight.secondary} 50%, transparent 60%)`
                }
            })
        },
        child: { parent: 'd-flex' }
    }
}

const styles = {
    node: {
        scope: (isNode: boolean, selected: boolean, width: number, depth: number) => ({
            ...(isNode
                ? { backgroundColor: colors.lightScale[depth % colors.lightScale.length] }
                : {
                      background: `radial-gradient(ellipse at top, ${colors.highlight.secondary} 20%, transparent 30%)`
                  }),
            ...(selected && isNode ? { borderColor: colors.gray.secondary } : undefined),
            ...(selected && !isNode
                ? {
                      background: `radial-gradient(ellipse at top, ${colors.highlight.primary} 50%, transparent 60%)`
                  }
                : undefined),
            opacity: width >= 20 ? 1 : width >= 10 ? 0.75 : 0.5
        })
    }
}

export function Stack() {
    const stackRef = React.useRef<HTMLDivElement>()
    const [width, setWidth] = React.useState(0)
    const dispatch = useDispatch()
    const { debugIndexer, debugResult, debugStack } = useRedux(state => ({
        debugIndexer: state.debugIndexer,
        debugResult: state.debugResult,
        debugStack: state.debugStack
    }))

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (!stackRef.current || stackRef.current.clientWidth === width) return
            setWidth(stackRef.current.clientWidth)
        }, 100)
        return () => clearInterval(interval)
    }, [width])

    const handleStackControls = (event: React.KeyboardEvent) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
        const previousFilter = (index: number) => index < debugIndexer
        const nextFilter = (index: number) => index > debugIndexer
        const indexFilter = event.key === 'ArrowLeft' ? previousFilter : nextFilter

        const currentStep = debugResult.steps[debugIndexer]
        const anyFamilyFilter = (step: protocol.IStep) => true
        const siblingParentFilter = (step: protocol.IStep) =>
            !!step.snapshot && !!currentStep.snapshot
                ? step.snapshot.stack.length <= currentStep.snapshot.stack.length
                : true
        const familyFilter = !event.ctrlKey ? anyFamilyFilter : siblingParentFilter

        const resultSelector = <T extends {}>(array: T[]) =>
            array.length > 0 ? (event.key === 'ArrowLeft' ? array[array.length - 1] : array[0]) : debugIndexer

        const selectedIndices = debugResult.steps
            .map((step, i) => ({ step, i }))
            .filter(({ step, i }) => familyFilter(step) && indexFilter(i))
            .map(({ i }) => i)

        dispatch(debugIndexerActions.set(resultSelector(selectedIndices)))
    }

    return (
        <div ref={stackRef} className={classes.stack.container} onKeyDown={handleStackControls} tabIndex={0}>
            {!!debugStack.tree && <Node node={debugStack.tree} indexer={debugIndexer} depth={0} width={width} />}
        </div>
    )
}

function Node(props: { node: StackNode; indexer: number; depth: number; width: number }) {
    const dispatch = useDispatch()
    const selected = props.indexer >= props.node.steps.from && props.indexer <= props.node.steps.to
    const isNode = props.node.children.length !== 0
    const isRoot = isNode && props.node.name == undefined

    const computeChildWidth = (child: StackNode) => {
        const proportion = (child.steps.to - child.steps.from + 1) / (props.node.steps.to - props.node.steps.from + 1)
        return { width: proportion * props.width, percent: `${proportion * 100}%` }
    }

    return (
        <div className={classes.node.container}>
            {!isRoot && (
                <div
                    className={cn(classes.node.scope.base, isNode ? classes.node.scope.node : classes.node.scope.leaf)}
                    style={styles.node.scope(isNode, selected, props.width, props.depth)}
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
                            <div key={i} className={classes.node.child.parent} style={{ width: percent }}>
                                <Node node={child} indexer={props.indexer} depth={props.depth + 1} width={width} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
