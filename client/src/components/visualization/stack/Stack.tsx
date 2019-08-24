import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { useRedux } from '../../../reducers/Store'
import { Scope } from './Scope'

const classes = {
    container: cn('d-flex align-items-start flex-nowrap', 'overflow-auto', 'w-100 h-100', css({ userSelect: 'none' }))
}

export const Stack = React.memo(() => {
    const ref = React.useRef<HTMLDivElement>()
    const [width, setWidth] = React.useState(0)
    const { available, stackData } = useRedux(state => ({
        available: state.tracer.available,
        stackData: state.tracer.stackData
    }))

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (ref.current.clientWidth === width) return
            setWidth(ref.current.clientWidth)
        }, 1000)

        return () => clearInterval(interval)
    }, [ref, width])

    return (
        <div ref={ref} className={classes.container}>
            {available && <Scope scope={stackData.root} depth={-1} width={width} />}
        </div>
    )
})
