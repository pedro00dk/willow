import cn from 'classnames'
import * as React from 'react'
import { useRedux } from '../../../reducers/Store'
import { MemoScopeNode } from './ScopeNode'

const classes = {
    container: cn('d-flex flex-row align-items-start flex-nowrap', 'overflow-auto', 'w-100 h-100')
}

// tslint:disable-next-line:variable-name
export const MemoStack = React.memo(Stack)
function Stack() {
    const ref = React.useRef<HTMLDivElement>()
    const [width, setWidth] = React.useState(0)
    const { available, stack } = useRedux(state => ({ available: state.tracer.available, stack: state.tracer.stack }))

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (!ref.current || ref.current.clientWidth === width) return
            setWidth(ref.current.clientWidth)
        }, 500)

        return () => clearInterval(interval)
    }, [ref, width])

    return (
        <div ref={ref} className={classes.container}>
            {available && <MemoScopeNode scope={stack.root} depth={0} width={width} />}
        </div>
    )
}
