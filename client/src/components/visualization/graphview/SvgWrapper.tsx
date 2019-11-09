import { css } from 'emotion'
import React from 'react'
import { DefaultState } from '../../../reducers/Store'
import { GraphController } from './GraphController'

const classes = {
    container: css({ cursor: 'move', transition: 'x 0.2s ease-out, y 0.2s ease-out' })
}

export const SvgWrapper = (props: {
    id: string
    tracer: DefaultState['tracer']
    controller: GraphController
    updateGraph: React.Dispatch<{}>
    children?: React.ReactNode
}) => {
    const ref = React.useRef<SVGForeignObjectElement>()
    const pathRef = React.useRef<SVGForeignObjectElement>()

    React.useLayoutEffect(() => {
        const updateRect = (subscriptionCall?: number) => {
            const position = props.controller.getPosition(props.id, props.tracer.index, { x: 0, y: 0 })
            const size = props.controller.getSize(props.id, props.tracer.index, { x: 0, y: 0 })
            ref.current.setAttribute('x', position.x.toString())
            ref.current.setAttribute('y', position.y.toString())
            ref.current.setAttribute('width', size.x.toString())
            ref.current.setAttribute('height', size.y.toString())
        }

        updateRect()
        props.controller.subscribe(props.id, updateRect)
    })

    // React.useEffect(() => {
    //     let previousSubscriptionIndex = undefined as number

    //     const updatePaths = (subscriptionIndex?: number) => {
    //         if (previousSubscriptionIndex !== undefined && previousSubscriptionIndex === subscriptionIndex) return
    //         previousSubscriptionIndex = subscriptionIndex
    //         const targets = props.controller.getTargets(id)
    //         pathRefs.current.forEach(pathRef => pathRef.setAttribute('visibility', 'hidden'))
    //         targets.forEach(({ target, delta }, i) => {
    //             const sourcePosition = props.controller.getPosition(id, index)
    //             const targetPosition = props.controller.getPosition(target, index)
    //             const targetSize = props.controller.getSize(target, index)
    //             const pathCoordinates = computePathCoordinates(sourcePosition, delta, targetPosition, targetSize)
    //             const pathRef = pathRefs.current[i]
    //             pathRef.setAttribute('visibility', 'visible')
    //             pathRef.setAttribute('d', pathCoordinates)
    //         })
    //     }
    //     updatePaths()
    //     props.controller.subscribe(id, updatePaths)
    //     props.controller.getTargets(id).forEach(({ target }) => props.controller.subscribe(target, updatePaths))
    // })

    return (
        <>
            <defs>
                <marker
                    id='pointer'
                    markerWidth={10}
                    markerHeight={8}
                    refX={8}
                    refY={4}
                    orient='auto'
                    markerUnits='userSpaceOnUse'
                >
                    {/* <polyline className={classes.polyline} points='0 0, 10 4, 0 8' /> */}
                </marker>
            </defs>
            <g ref={pathRef} />
            <foreignObject ref={ref} className={classes.container}>
                {props.children}
            </foreignObject>
        </>
    )
}
