import cn from 'classnames'
import * as React from 'react'
import * as protocol from '../../../protobuf/protocol'
import { actions as debugIndexerActions } from '../../../reducers/debug/indexer'
import { useDispatch, useRedux } from '../../../reducers/Store'
import { StackNode } from './StackNode'

const classes = {
    container: cn('d-flex flex-row align-items-start flex-nowrap', 'overflow-auto', 'w-100 h-100')
}

export function Stack() {
    const stackRef = React.useRef<HTMLDivElement>()
    const [width, setWidth] = React.useState(0)
    const dispatch = useDispatch()
    const { debugIndexer, debugResult, debugStack } = useRedux(state => ({
        debugIndexer: state.debugIndexer,
        debugResult: state.debugResult,
        debugStack: state.debugStack
    }))

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (!stackRef.current || stackRef.current.clientWidth === width) return
            setWidth(stackRef.current.clientWidth)
        }, 100)
        return () => clearInterval(interval)
    }, [width])

    const handleStackControls = (event: React.KeyboardEvent) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
        const previousFilter = (index: number) => index < debugIndexer
        const nextFilter = (index: number) => index > debugIndexer
        const indexFilter = event.key === 'ArrowLeft' ? previousFilter : nextFilter

        const currentStep = debugResult.steps[debugIndexer]
        const anyFamilyFilter = (step: protocol.IStep) => true
        const siblingParentFilter = (step: protocol.IStep) =>
            !!step.snapshot && !!currentStep.snapshot
                ? step.snapshot.stack.length <= currentStep.snapshot.stack.length
                : true
        const familyFilter = !event.ctrlKey ? anyFamilyFilter : siblingParentFilter

        const resultSelector = <T extends {}>(array: T[]) =>
            array.length > 0 ? (event.key === 'ArrowLeft' ? array[array.length - 1] : array[0]) : debugIndexer

        const selectedIndices = debugResult.steps
            .map((step, i) => ({ step, i }))
            .filter(({ step, i }) => familyFilter(step) && indexFilter(i))
            .map(({ i }) => i)

        dispatch(debugIndexerActions.set(resultSelector(selectedIndices)))
    }

    return (
        <div ref={stackRef} className={classes.container} onKeyDown={handleStackControls} tabIndex={0}>
            {!!debugStack.tree && <StackNode node={debugStack.tree} indexer={debugIndexer} depth={0} width={width} />}
        </div>
    )
}
