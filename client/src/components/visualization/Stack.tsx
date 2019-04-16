import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../colors'
import * as protocol from '../../protobuf/protocol'
import { actions as debugIndexerActions } from '../../reducers/debug/indexer'
import { StackNode } from '../../reducers/debug/stack'
import { useDispatch, useRedux } from '../../reducers/Store'

const classes = {
    node: {
        scope: {
            base: cn(
                'text-truncate w-100',
                css({
                    border: 'transparent solid',
                    backgroundClip: 'content-box !important',
                    cursor: 'default',
                    fontSize: '0.7rem'
                })
            ),
            node: css({ ':hover': { borderColor: `${colors.grayScale[4]} !important` } }),
            leaf: css({
                ':hover': { background: `radial-gradient(ellipse at top, ${colors.highlight0} 50%, transparent 60%)` }
            })
        }
    }
}

const styles = {
    node: {
        scope: (leaf: boolean, selected: boolean, width: number, depth: number) => ({
            ...(leaf
                ? { background: `radial-gradient(ellipse at top, ${colors.highlight1} 20%, transparent 30%)` }
                : { backgroundColor: colors.lightScale[depth % colors.lightScale.length] }),
            ...(selected
                ? leaf
                    ? { background: `radial-gradient(ellipse at top, ${colors.highlight0} 50%, transparent 60%)` }
                    : { borderColor: colors.grayScale[2] }
                : undefined),
            borderWidth: 0.5,
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
        <div
            ref={stackRef}
            className='d-flex flex-row align-items-start flex-nowrap overflow-auto w-100'
            onKeyDown={handleStackControls}
            tabIndex={0}
        >
            {!!debugStack.tree && (
                <Node
                    node={debugStack.tree}
                    indexer={debugIndexer}
                    depth={0}
                    width={{ percent: '100%', pixels: width }}
                />
            )}
        </div>
    )
}

function Node(props: { node: StackNode; indexer: number; depth: number; width: { percent: string; pixels: number } }) {
    const dispatch = useDispatch()
    const selected = props.indexer >= props.node.steps.from && props.indexer <= props.node.steps.to
    const leaf = props.node.children.length === 0

    const computeChildWidth = (child: StackNode) => {
        const proportion = (child.steps.to - child.steps.from + 1) / (props.node.steps.to - props.node.steps.from + 1)
        return { pixels: proportion * props.width.pixels, percent: `${proportion * 100}%` }
    }

    return (
        <div className='d-flex flex-column' style={{ width: props.width.percent }}>
            {(props.node.name != undefined || leaf) && (
                <div
                    className={cn(classes.node.scope.base, leaf ? classes.node.scope.leaf : classes.node.scope.node)}
                    style={styles.node.scope(leaf, selected, props.width.pixels, props.depth)}
                    title={props.node.name}
                    onClick={() => dispatch(debugIndexerActions.set(props.node.steps.from))}
                >
                    {!leaf && props.width.pixels >= 20 ? props.node.name : '\u200b'}
                </div>
            )}
            {!leaf && props.width.pixels >= 5 && (
                <div className='d-flex flex-row'>
                    {props.node.children.map((child, i) => (
                        <Node
                            key={i}
                            node={child}
                            indexer={props.indexer}
                            depth={props.depth + 1}
                            width={computeChildWidth(child)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
