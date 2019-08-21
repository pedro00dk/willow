import cn from 'classnames'
import * as React from 'react'
import { useRedux } from '../../../reducers/Store'
import { Scope } from './Scope'

const classes = { container: cn('d-flex align-items-start flex-nowrap', 'overflow-auto', 'w-100 h-100') }

export const Stack = React.memo(() => {
    const ref = React.useRef<HTMLDivElement>()
    const [width, setWidth] = React.useState(0)
    const { available, stack } = useRedux(state => ({ available: state.tracer.available, stack: state.tracer.stack }))

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (ref.current.clientWidth === width) return
            setWidth(ref.current.clientWidth)
        }, 1000)

        return () => clearInterval(interval)
    }, [ref, width])

    return (
        <div ref={ref} className={classes.container}>
            {available && <Scope scope={stack.root} depth={-1} width={width} />}
        </div>
    )
})
