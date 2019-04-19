import cn from 'classnames'
import * as React from 'react'
import * as protocol from '../../../protobuf/protocol'
import { State, useDispatch, useRedux } from '../../../reducers/Store'
import { actions as tracerActions } from '../../../reducers/tracer'
import { ScopeNode } from './ScopeNode'

const classes = {
    container: cn('d-flex flex-row align-items-start flex-nowrap', 'overflow-auto', 'w-100 h-100')
}

const computeNextIndex = (event: React.KeyboardEvent, tracer: State['tracer']) => {
    if (!tracer.available || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return
    const previousFilter = (index: number) => index < tracer.index
    const nextFilter = (index: number) => index > tracer.index
    const indexFilter = event.key === 'ArrowLeft' ? previousFilter : nextFilter

    const currentStep = tracer.steps[tracer.index]
    const anyFamilyFilter = (step: protocol.IStep) => true
    const siblingParentFilter = (step: protocol.IStep) =>
        !!step.snapshot && !!currentStep.snapshot
            ? step.snapshot.stack.length <= currentStep.snapshot.stack.length
            : true
    const familyFilter = !event.ctrlKey ? anyFamilyFilter : siblingParentFilter

    const resultSelector = <T extends {}>(array: T[]) =>
        array.length > 0 ? (event.key === 'ArrowLeft' ? array[array.length - 1] : array[0]) : tracer.index

    const selectedIndices = tracer.steps
        .map((step, i) => ({ step, i }))
        .filter(({ step, i }) => familyFilter(step) && indexFilter(i))
        .map(({ i }) => i)
    return resultSelector(selectedIndices)
}

export function Stack() {
    const stackRef = React.useRef<HTMLDivElement>()
    const [width, setWidth] = React.useState(0)
    const dispatch = useDispatch()
    const { tracer, visualization } = useRedux(state => ({ tracer: state.tracer, visualization: state.visualization }))

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (!stackRef.current || stackRef.current.clientWidth === width) return
            setWidth(stackRef.current.clientWidth)
        }, 100)
        return () => clearInterval(interval)
    }, [width])

    return (
        <div
            ref={stackRef}
            className={classes.container}
            onKeyDown={event => dispatch(tracerActions.setIndex(computeNextIndex(event, tracer)))}
            tabIndex={0}
        >
            {tracer.available && (
                <ScopeNode scope={visualization.stack.root} index={tracer.index} depth={0} width={width} />
            )}
        </div>
    )
}
