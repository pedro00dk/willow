import cn from 'classnames'
import * as React from 'react'
import { useRedux } from '../../../reducers/Store'
import { ScopeComp } from './ScopeComp'

const classes = {
    container: cn('d-flex', 'overflow-auto', 'h-100 w-100')
}

export const Stack = React.memo(() => {
    const ref = React.useRef<HTMLDivElement>()
    const [width, setWidth] = React.useState(0)
    const { available, stack } = useRedux(state => ({ available: state.tracer.available, stack: state.tracer.stack }))
    const scopeHeight = 20

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (!ref.current || ref.current.clientWidth === width) return
            setWidth(ref.current.clientWidth)
        }, 1000)

        return () => clearInterval(interval)
    }, [ref, width])

    return (
        <div ref={ref} className={classes.container}>
            {available && (
                <svg width='100%' height={`${scopeHeight * stack.depth}px`}>
                    <ScopeComp
                        scope={stack.root}
                        depth={stack.depth}
                        current={-1}
                        baseX={0}
                        baseY={0}
                        width={width}
                        height={scopeHeight}
                    />
                </svg>
            )}
        </div>
    )
})
