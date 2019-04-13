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
            nonTerminal: cn(
                'text-truncate w-100',
                css({
                    borderStyle: 'solid',
                    borderColor: 'transparent',
                    backgroundClip: 'padding-box',
                    cursor: 'default',
                    fontSize: '0.7rem',
                    opacity: 0.7,
                    ':hover': {
                        borderColor: `${colors.grayScale[3]} !important`
                    }
                })
            ),
            terminal: cn(
                'text-truncate',
                css({
                    borderStyle: 'solid',
                    borderColor: 'transparent',
                    backgroundClip: 'content-box !important',
                    cursor: 'default',
                    fontSize: '0.7rem',
                    background: `radial-gradient(ellipse at top, ${colors.highlight1} 20%, transparent 30%)`,
                    ':hover': {
                        background: `radial-gradient(ellipse at top, ${colors.highlight0} 50%, transparent 60%)`
                    }
                })
            )
        }
    }
}

const styles = {
    node: {
        scope: (terminal: boolean, selected: boolean, width: number, depth: number) => ({
            ...(terminal
                ? { background: `radial-gradient(ellipse at top, ${colors.highlight1} 20%, transparent 30%)` }
                : { backgroundColor: colors.lightScale[depth % colors.lightScale.length], opacity: '0.75' }),
            ...(selected
                ? terminal
                    ? { background: `radial-gradient(ellipse at top, ${colors.highlight0} 50%, transparent 60%)` }
                    : { borderColor: colors.grayScale[1] }
                : undefined),
            borderWidth: 0.5,
            opacity: width >= 20 ? 1 : width >= 10 ? 0.75 : 0.5
        })
    }
}

export function Stack() {
    const dispatch = useDispatch()
    const { debugIndexer, debugResult, debugStack } = useRedux(state => ({
        debugIndexer: state.debugIndexer,
        debugResult: state.debugResult,
        debugStack: state.debugStack
    }))
    const stackRef = React.useRef<HTMLDivElement>()
    const [computedWidth, setComputedWidth] = React.useState(Infinity)

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (!stackRef.current || stackRef.current.clientWidth === computedWidth) return
            setComputedWidth(stackRef.current.clientWidth)
        }, 50)
        return () => clearInterval(interval)
    }, [computedWidth])

    return (
        <div
            ref={stackRef}
            className='d-flex flex-row align-items-start flex-nowrap overflow-auto w-100'
            onKeyDown={event => {
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
            }}
            tabIndex={0}
        >
            {!!debugStack.tree && (
                <Node node={debugStack.tree} indexer={debugIndexer} depth={0} computedWidth={computedWidth} />
            )}
        </div>
    )
}

function Node(props: { node: StackNode; indexer: number; depth: number; computedWidth?: number }) {
    const dispatch = useDispatch()
    const selected = props.indexer >= props.node.steps.from && props.indexer <= props.node.steps.to
    const terminal = props.node.children.length === 0
    const computedWidth = !props.computedWidth ? Infinity : props.computedWidth

    return (
        <div className='d-flex flex-column w-100'>
            {props.node.steps.from != undefined && (
                <div
                    className={terminal ? classes.node.scope.terminal : classes.node.scope.nonTerminal}
                    style={styles.node.scope(terminal, selected, computedWidth, props.depth)}
                    title={props.node.name}
                    onClick={() => dispatch(debugIndexerActions.set(props.node.steps.from))}
                >
                    {!terminal && computedWidth >= 20 ? props.node.name : '\u200b'}
                </div>
            )}
            {!terminal && computedWidth >= 4 && (
                <div className='d-flex flex-row'>
                    {props.node.children.map((child, i) => {
                        const proportion =
                            (child.steps.to - child.steps.from + 1) / (props.node.steps.to - props.node.steps.from + 1)
                        const childComputedWidth = proportion * computedWidth
                        const childPercentWidth = `${proportion * 100}%`
                        return (
                            <div key={i} style={{ width: childPercentWidth }}>
                                <Node
                                    node={child}
                                    indexer={props.indexer}
                                    depth={props.depth + 1}
                                    computedWidth={childComputedWidth}
                                />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
