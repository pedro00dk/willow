import cn from 'classnames'
import * as React from 'react'
import * as protocol from '../../protobuf/protocol'
import { State, useDispatch, useRedux } from '../../reducers/Store'
import { actions as tracerActions } from '../../reducers/tracer'
import { SplitPane } from '../SplitPane'
import { MemoHeap } from './heap/Heap'
import { MemoStack } from './stack/Stack'

const classes = {
    container: cn('d-flex', 'w-100 h-100')
}

const computeNextIndex = (event: React.KeyboardEvent, tracer: State['tracer']) => {
    if (!tracer.available || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return tracer.index
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

export function Visualization() {
    const dispatch = useDispatch()
    const { tracer } = useRedux(state => ({ tracer: state.tracer, stack: state.visualization.stack }))

    return (
        <div
            className={classes.container}
            onKeyDown={event => dispatch(tracerActions.setIndex(computeNextIndex(event, tracer)))}
            tabIndex={0}
        >
            <SplitPane split='horizontal' base='15%' left={5} right={-5}>
                <MemoStack />
                <MemoHeap />
            </SplitPane>
        </div>
    )
}
