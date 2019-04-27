import cn from 'classnames'
import * as React from 'react'
import { useRedux } from '../../../reducers/Store'
import { MemoScopeNode } from './ScopeNode'

const classes = {
    container: cn('d-flex flex-row align-items-start flex-nowrap', 'overflow-auto', 'w-100 h-100')
}

// tslint:disable-next-line: variable-name
export const MemoStack = React.memo(Stack)
export function Stack() {
    const stackRef = React.useRef<HTMLDivElement>()
    const [width, setWidth] = React.useState(0)
    const { tracerAvailable, stack } = useRedux(state => ({
        tracerAvailable: state.tracer.available,
        stack: state.visualization.stack
    }))

    React.useLayoutEffect(() => {
        const interval = setInterval(() => {
            if (!stackRef.current || stackRef.current.clientWidth === width) return
            setWidth(stackRef.current.clientWidth)
        }, 100)
        return () => clearInterval(interval)
    }, [width])

    return (
        <div ref={stackRef} className={classes.container}>
            {tracerAvailable && <MemoScopeNode scope={stack.root} depth={0} width={width} />}
        </div>
    )
}
