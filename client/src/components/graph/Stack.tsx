import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'

type ScopeNode = {
    name: string
    steps: number
    subScopes: (number | ScopeNode)[]
}

const callNodeColors = ['khaki', 'greenyellow', 'palegreen', 'aquamarine', 'skyblue', 'mediumpurple', 'pink']

const classes = {
    callNode: {
        container: 'd-flex flex-column w-100',
        scope: cn(
            'text-truncate',
            css({ borderStyle: 'solid', borderColor: 'transparent', backgroundClip: 'padding-box', fontSize: '0.7rem' })
        )
    }
}

const styles = {
    callNode: {
        scope: (width: number, depth: number) => ({
            backgroundColor: callNodeColors[depth % callNodeColors.length],
            opacity: width >= 20 ? 1 : width >= 10 ? 0.75 : 0.5,
            borderWidth: `1px ${width >= 5 ? 1 : 0}px 0px 0px`
        })
    }
}

export function Stack() {
    const scopeNode: ScopeNode = {
        name: '<script>',
        steps: 18,
        subScopes: [
            4,
            {
                name: 'add',
                steps: 6,
                subScopes: [
                    2,
                    { name: 'test', steps: 4, subScopes: [{ name: 'into', steps: 1, subScopes: [1] }, 1, 1, 1] }
                ]
            },
            2,
            { name: 'remove', steps: 4, subScopes: [4] },
            2
        ]
    }

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
            <CallNode node={scopeNode} depth={0} computedWidth={computedWidth} />
        </div>
    )
}

function CallNode(props: { node: ScopeNode; depth: number; computedWidth?: number }) {
    const computedWidth = !props.computedWidth ? Infinity : props.computedWidth

    return (
        <div className={classes.callNode.container}>
            <div className={classes.callNode.scope} style={styles.callNode.scope(computedWidth, props.depth)}>
                {computedWidth >= 20 ? props.node.name : '\u200b'}
            </div>
            {computedWidth >= 2 && (
                <div className='d-flex flex-row'>
                    {props.node.subScopes.map((subScope, i) => {
                        const steps = typeof subScope === 'number' ? subScope : subScope.steps
                        const subNodeProportion = steps / props.node.steps
                        const subNodeComputedWidth = subNodeProportion * computedWidth
                        const subNodePercentWidth = `${subNodeProportion * 100}%`
                        return (
                            <div key={i} style={{ width: subNodePercentWidth }}>
                                {typeof subScope !== 'number' && (
                                    <CallNode
                                        node={subScope}
                                        depth={props.depth + 1}
                                        computedWidth={subNodeComputedWidth}
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}