import React from 'react'
import { DefaultState } from '../../../../reducers/Store'
import { GraphData } from '../GraphData'
import { SvgNode } from '../svg/SvgNode'
import { Obj } from './Obj'

export const Heap = (props: {
    graphData: GraphData
    forceUpdate: React.Dispatch<{}>
    tracer: DefaultState['tracer']
}) => (
    <>
        {props.tracer.steps &&
            Object.entries(props.tracer.steps[props.graphData.getIndex()].snapshot?.heap ?? {}).map(([id, obj]) => (
                <SvgNode key={id} id={id} graphData={props.graphData}>
                    <Obj id={id} obj={obj} {...props} />
                </SvgNode>
            ))}
    </>
)
