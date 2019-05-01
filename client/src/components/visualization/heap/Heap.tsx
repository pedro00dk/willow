import cn from 'classnames'
import * as React from 'react'
import { useDispatch, useRedux } from '../../../reducers/Store'
import { actions as visualizationActions } from '../../../reducers/visualization'
import { MemoNodeWrapper } from './NodeWrapper'

const classes = {
    container: cn('d-flex', 'w-100 h-100')
}

// tslint:disable-next-line: variable-name
export const MemoHeap = React.memo(Heap)
export function Heap() {
    const objects = React.useRef<{ [reference: string]: HTMLElement }>({})
    const references = React.useRef<{ [reference: string]: HTMLElement[] }>({})

    const dispatch = useDispatch()
    const { tracer, visualizationHeaps, visualizationObjTranslations, visualizationScale } = useRedux(state => ({
        tracer: state.tracer,
        visualizationHeaps: state.visualization.heaps,
        visualizationObjTranslations: state.visualization.objTranslations,
        visualizationScale: state.visualization.scale
    }))

    if (!tracer.available) {
        objects.current = {}
        references.current = {}
    }

    return (
        <>
            <div
                className={classes.container}
                onWheel={event => {
                    const scaleMultiplier = event.deltaY < 0 ? 0.95 : event.deltaY > 0 ? 1.05 : 1
                    const scale = Math.max(0.5, Math.min(visualizationScale * scaleMultiplier, 4))
                    dispatch(visualizationActions.setScale(scale))
                }}
            >
                {tracer.available &&
                    Object.values(visualizationHeaps[tracer.index]).map(obj => (
                        <MemoNodeWrapper key={obj.reference} obj={obj} objects={objects} references={references} />
                    ))}
            </div>
            <svg className='position-fixed' style={{ left: 0, top: 0, zIndex: -1 }} width='100vw' height='100vh'>
                <defs>
                    <linearGradient id='links' x1='0%' y1='0%' x2='100%' y2='0%'>
                        <stop offset='0%' stop-color='rgb(255, 0, 0)' stop-opacity='1' />
                        <stop offset='100%' stop-color='rgb(0, 0, 0)' stop-opacity='1' />
                    </linearGradient>
                </defs>
                {Object.entries(objects.current).map(([reference, objectElement]) => {
                    if (!references.current[reference]) return false
                    return (
                        <>
                            {Object.values(references.current[reference]).map(referenceElement => {
                                if (!referenceElement) return false
                                const objectBB = objectElement.getBoundingClientRect()
                                const referenceBB = referenceElement.getBoundingClientRect()
                                if (objectBB.left < 10 || referenceBB.left < 10) return false // TODO check when components draws change
                                return (
                                    <line
                                        x1={referenceBB.left + referenceBB.width / 2}
                                        y1={referenceBB.top + referenceBB.height / 2}
                                        x2={objectBB.left + objectBB.width / 2}
                                        y2={objectBB.top + objectBB.height / 2}
                                        stroke='url(#links)'
                                        strokeWidth='2'
                                    />
                                )
                            })}
                        </>
                    )
                })}
            </svg>
        </>
    )
}
