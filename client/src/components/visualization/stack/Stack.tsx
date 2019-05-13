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
    const { tracer } = useRedux(state => ({ tracer: state.tracer }))

    React.useLayoutEffect(() => {
        const interval = setInterval(() => {
            if (!stackRef.current || stackRef.current.clientWidth === width) return
            setWidth(stackRef.current.clientWidth)
        }, 500)
        return () => clearInterval(interval)
    }, [width])

    return (
        <div ref={stackRef} className={classes.container}>
            {tracer.available && <MemoScopeNode scope={tracer.stack.root} depth={0} width={width} />}
        </div>
    )
}
