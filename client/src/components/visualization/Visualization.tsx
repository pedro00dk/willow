import cn from 'classnames'
import * as React from 'react'
import { State, useDispatch, useRedux } from '../../reducers/Store'
import { actions as tracerActions } from '../../reducers/tracer'
import * as schema from '../../schema/schema'
import { SplitPane } from '../SplitPane'
import { Heap } from './heap/Heap'
import { Stack } from './stack/Stack'

const classes = {
    container: cn('d-flex', 'w-100 h-100')
}

const computeNextIndex = (event: React.KeyboardEvent, tracer: State['tracer']) => {
    if (!tracer.available || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return tracer.index
    const currentStep = tracer.steps[tracer.index]

    const indexFilter = (index: number) => (event.key === 'ArrowLeft' ? index < tracer.index : index > tracer.index)
    const anyFamilyFilter = (step: schema.Step) => true
    const siblingParentFilter = (step: schema.Step) =>
        step.snapshot && currentStep.snapshot ? step.snapshot.stack.length <= currentStep.snapshot.stack.length : true
    const familyFilter = !event.ctrlKey ? anyFamilyFilter : siblingParentFilter

    const resultSelector = <T extends {}>(array: T[]) =>
        array.length > 0 ? (event.key === 'ArrowLeft' ? array[array.length - 1] : array[0]) : tracer.index

    const selectedIndices = tracer.steps
        .map((step, i) => ({ step, i }))
        .filter(({ step, i }) => familyFilter(step) && indexFilter(i))
        .map(({ i }) => i)
    return resultSelector(selectedIndices)
}

export function Visualization() {
    const dispatch = useDispatch()
    const { tracer } = useRedux(state => ({ tracer: state.tracer }))

    return (
        <div
            className={classes.container}
            onKeyDown={event => {
                const nextIndex = computeNextIndex(event, tracer)
                if (nextIndex === tracer.index) return
                dispatch(tracerActions.setIndex(nextIndex))
            }}
            tabIndex={0}
        >
            <SplitPane layout='column' ratio={0.3}>
                <Stack />
                <Heap />
            </SplitPane>
        </div>
    )
}
