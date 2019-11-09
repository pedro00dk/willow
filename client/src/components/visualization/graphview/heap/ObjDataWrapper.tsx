import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import { DefaultState } from '../../../../reducers/Store'
import { ObjData } from '../../../../reducers/tracer'
import { GraphController } from '../GraphController'
import { Draggable } from '../../../Draggable'
import { svgScreenTransformVector, svgElementContext } from '../SvgView'

const classes = {
    container: cn('d-flex position-absolute', css({ userSelect: 'none' }))
}

export const ObjDataWrapper = (props: {
    objData: ObjData
    tracer: DefaultState['tracer']
    controller: GraphController
    updateGraph: React.Dispatch<{}>
}) => {
    const ref = React.useRef<HTMLDivElement>()
    const getSvgElement = React.useContext(svgElementContext)

    return (
        <Draggable
            props={{ ref, className: classes.container }}
            onDrag={(delta, event) => {
                const [svgDelta] = svgScreenTransformVector('toSvg', getSvgElement(), delta)
                const depth = !event.altKey ? 0 : Infinity
                const update = !event.ctrlKey ? 'from' : !event.altKey ? 'all' : 'single'
                moveWrappers(svgDelta, depth, update)
            }}
        >
            {/* <MenuProvider id={id} className={classes.menuProvider}>
                <div
                    className={classes.menuProvider}
                    onDoubleClick={event => {
                        const update = !event.ctrlKey ? 'from' : !event.altKey ? 'all' : 'single'
                        repositionWrappers(update)
                    }}
                >
                    <Node
                        objData={props.objData}
                        parameters={parameterSelector === 'id' ? idParameters : typeParameters}
                        onTargetRef={(id, target, ref) => targetRefs.current.push({ target, element: ref })}
                    />
                </div>
            </MenuProvider> */}
        </Draggable>
    )
}
