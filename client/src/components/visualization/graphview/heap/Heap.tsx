import React from 'react'
import { DefaultState } from '../../../../reducers/Store'
import { GraphController } from '../GraphController'
import { SvgWrapper } from '../SvgWrapper'
import { Obj } from './Obj'

export const Heap = (props: {
    controller: GraphController
    updateGraph: React.Dispatch<{}>
    tracer: DefaultState['tracer']
}) => (
    <>
        {Object.values(props.tracer.heapsData[props.tracer.index]).map(objData => (
            <SvgWrapper
                key={objData.id}
                id={objData.id}
                paths={objData.members.reduce((acc, next) => acc + Number(typeof next.value === 'object'), 0)}
                {...props}
            >
                <Obj objData={objData} {...props} />
            </SvgWrapper>
        ))}
    </>
)
