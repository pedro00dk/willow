import React from 'react'
import { DefaultState } from '../../../../reducers/Store'
import { GraphController } from '../GraphController'
import { SvgWrapper } from '../SvgWrapper'

export const Heap = (props: {
    controller: GraphController
    updateGraph: React.Dispatch<{}>
    tracer: DefaultState['tracer']
}) => {
    const stack = props.tracer.steps[props.tracer.index].snapshot.stack
    stack[0].variables
        .filter(variable => typeof variable.value === 'object')
        .forEach(variable => {
            const id = (variable.value as [string])[0]
            props.controller.getTargets(id)
        })
    // props.controller.getR
    return false
}
