import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../../colors'
import { actions as debugReferenceActions } from '../../reducers/debug/reference'
import { StackNode } from '../../reducers/debug/stack'
import { useDispatch, useRedux } from '../../reducers/Store'

const classes = {
    node: {
        container: 'd-flex flex-column w-100',
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
    const dispatch = useDispatch()
    const { debugReference } = useRedux(state => ({ debugReference: state.debugReference }))
    const selected = debugReference >= props.node.steps.from && debugReference <= props.node.steps.to
    const terminal = props.node.children.length === 0
    const computedWidth = !props.computedWidth ? Infinity : props.computedWidth

    return (
        <div className={classes.node.container}>
            {props.node.steps.from != undefined && (
                <div
                    className={terminal ? classes.node.scope.terminal : classes.node.scope.nonTerminal}
                    style={styles.node.scope(terminal, selected, computedWidth, props.depth)}
                    title={props.node.name}
                    onClick={() => dispatch(debugReferenceActions.set(props.node.steps.from))}
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
                                <Node node={child} depth={props.depth + 1} computedWidth={childComputedWidth} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
