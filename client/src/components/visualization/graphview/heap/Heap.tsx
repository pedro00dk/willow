import React from 'react'
import { DefaultState } from '../../../../reducers/Store'
import { GraphController } from '../GraphController'
import { Wrapper } from '../Wrapper'

export const Heap = (props: {
    controller: GraphController
    updateGraph: React.Dispatch<{}>
    tracer: DefaultState['tracer']
}) => (
    <>
        {Object.values(props.tracer.heapsData[props.tracer.index]).map(objData => (
            <Wrapper
                key={objData.id}
                objData={objData}
                controller={props.controller}
                updateGraph={props.updateGraph}
                tracer={props.tracer}
            />
        ))}
    </>
)
