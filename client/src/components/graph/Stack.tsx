import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { actions as debugReferenceActions } from '../../reducers/debug/reference'
import { isStackNode, StackLeaf, StackNode } from '../../reducers/debug/stack'
import { useDispatch, useRedux } from '../../reducers/Store'

const callNodeColors = ['khaki', 'greenyellow', 'palegreen', 'aquamarine', 'skyblue', 'mediumpurple', 'pink']

const classes = {
    node: {
        container: 'd-flex flex-column w-100',
        scope: cn(
            'text-truncate',
            css({
                borderStyle: 'solid',
                borderColor: 'transparent',
                backgroundClip: 'padding-box',
                cursor: 'default',
                fontSize: '0.7rem'
            })
        )
    },
    leaf: {
        container: cn(
            'd-flex flex-column w-100',
            css({
                background: 'radial-gradient(ellipse at top, lightblue 20%, transparent 30%)',
                height: '0.7rem',
                ':hover': {
                    background: 'radial-gradient(ellipse at top, lightblue 50%, transparent 60%)'
                }
            })
        )
    }
}

const styles = {
    node: {
        scope: (width: number, depth: number) => ({
            backgroundColor: callNodeColors[depth % callNodeColors.length],
            borderWidth: `1px ${width >= 5 ? 1 : 0}px 0px 0px`,
            opacity: width >= 20 ? 1 : width >= 10 ? 0.75 : 0.5
        })
    },
    leaf: {
        selected: (selected: boolean) =>
            selected ? { background: 'radial-gradient(ellipse at top, blue 50%, transparent 60%)' } : undefined
    }
}

export function Stack() {
    const { debugStack } = useRedux(state => ({ debugStack: state.debugStack }))
    const stackRef = React.useRef<HTMLDivElement>()
    const [computedWidth, setComputedWidth] = React.useState(Infinity)

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (!stackRef.current || stackRef.current.clientWidth === computedWidth) return
            setComputedWidth(stackRef.current.clientWidth)
        })
        return () => clearInterval(interval)
    }, [computedWidth])

    return (
        <div ref={stackRef} className='d-flex flex-row align-items-start flex-nowrap h-100 w-100'>
            {!!debugStack.tree && <Node node={debugStack.tree} depth={0} computedWidth={computedWidth} />}
        </div>
    )
}

function Node(props: { node: StackNode; depth: number; computedWidth?: number }) {
    const computedWidth = !props.computedWidth ? Infinity : props.computedWidth
    return (
        <div className={classes.node.container}>
            <div
                className={classes.node.scope}
                style={styles.node.scope(computedWidth, props.depth)}
                title={props.node.name}
            >
                {computedWidth >= 20 ? props.node.name : '\u200b'}
            </div>
            {computedWidth >= 2 && (
                <div className='d-flex flex-row'>
                    {props.node.children.map((child, i) => {
                        const proportion = child.steps / props.node.steps
                        const childComputedWidth = proportion * computedWidth
                        const childPercentWidth = `${proportion * 100}%`
                        return (
                            <div key={i} style={{ width: childPercentWidth }}>
                                {isStackNode(child) ? (
                                    <Node node={child} depth={props.depth + 1} computedWidth={childComputedWidth} />
                                ) : (
                                    <Leaf leaf={child} depth={props.depth + 1} computedWidth={childComputedWidth} />
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function Leaf(props: { leaf: StackLeaf; depth: number; computedWidth?: number }) {
    const dispatch = useDispatch()
    const { debugReference } = useRedux(state => ({ debugReference: state.debugReference }))
    const selected = props.leaf.framesIndices.includes(debugReference)
    return (
        <div
            className={classes.leaf.container}
            style={styles.leaf.selected(selected)}
            onClick={() => dispatch(debugReferenceActions.set(props.leaf.framesIndices[0]))}
        />
    )
}
