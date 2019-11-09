import React from 'react'
import { DefaultState } from '../../../../reducers/Store'
import { GraphController } from '../GraphController'
import { SvgWrapper } from '../SvgWrapper'
import { ObjDataWrapper } from './ObjDataWrapper'

export const Heap = (props: {
    controller: GraphController
    updateGraph: React.Dispatch<{}>
    tracer: DefaultState['tracer']
}) => (
    <>
        {Object.values(props.tracer.heapsData[props.tracer.index]).map(objData => (
            <SvgWrapper key={objData.id} id={objData.id} {...props}>
                <ObjDataWrapper objData={objData} {...props} />
            </SvgWrapper>
        ))}
    </>
)
