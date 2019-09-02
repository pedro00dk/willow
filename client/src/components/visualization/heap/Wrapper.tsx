import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { Item, Menu, MenuProvider, Separator, Submenu } from 'react-contexify'
import { colors } from '../../../colors'
import { State } from '../../../reducers/Store'
import { ObjData } from '../../../reducers/tracer'
import { clamp, Draggable, lerp, svgScreenPointTransform, svgScreenVectorTransform } from '../../../Utils'
import * as ArrayModule from './Array'
import * as BarsModule from './Bars'
import { HeapControl, UnknownParameters } from './Heap'

import 'react-contexify/dist/ReactContexify.min.css'

const modules = {
    array: { ...ArrayModule },
    bars: { ...BarsModule }
}

const classes = {
    container: cn(css({ cursor: 'move' /*, transition: 'x 0.1s ease-out, y 0.1s ease-out' */ })),
    draggable: cn('d-flex position-absolute', css({ userSelect: 'none' })),
    menuProvider: cn('d-flex'),
    selected: cn(css({ background: colors.blue.lighter })),
    path: cn(css({ stroke: colors.gray.dark, strokeWidth: 2, fill: 'none' })),
    polyline: cn(css({ stroke: colors.gray.dark, strokeWidth: 2, fill: 'none' }))
}

// const onReposition = (
//     event: React.MouseEvent<HTMLDivElement, MouseEvent>,
//     tracer: State['tracer'],
//     root: string,
//     rect: ClientRect | DOMRect,
//     positions: { [reference: string]: Position },
//     links: { [reference: string]: Link }
// ) => {
//     const data = tracer.groupMapsData[tracer.index][root]
//     if (!data) return

//     const anchor = positions[root].position
//     const space = rect.width - positions[root].position.x
//     const increment = space / data.depth
//     let distance = 0
//     positions[data.base].setPosition({ ...anchor, x: anchor.x + increment * distance })
//     const moved = new Set([data.base])
//     const previousLevel = new Set([data.base])
//     distance++
//     while (previousLevel.size > 0) {
//         const pool = [...previousLevel]
//             .map(reference => {
//                 const x = getLinked(reference, links, new Set(), 2)
//                 return x
//             })
//             .reduce((acc, n) => {
//                 n.forEach(reference => acc.add(reference))
//                 return acc
//             }, new Set<string>())
//         pool.forEach(reference => (!data.members.has(reference) ? pool.delete(reference) : undefined))
//         moved.forEach(reference => pool.delete(reference))
//         pool.forEach(reference => moved.add(reference))
//         pool.forEach(reference => positions[reference].setPosition({ ...anchor, x: anchor.x + increment * distance }))
//         previousLevel.clear()
//         pool.forEach(reference => previousLevel.add(reference))
//         distance++
//     }
// }

export const Wrapper = (props: {
    objData: ObjData
    tracer: State['tracer']
    heapControl: HeapControl
    updateHeap: React.Dispatch<{}>
}) => {
    const ref = React.useRef<SVGForeignObjectElement>()
    const childRef = React.useRef<HTMLDivElement>()
    const targetRefs = React.useRef<{ target: string; element: HTMLElement }[]>([])
    const pathRefs = React.useRef<SVGPathElement[]>([])
    const updateThis = React.useState({})[1]
    const { id, type, languageType } = props.objData
    const { index } = props.tracer
    const parameterSelector = props.heapControl.getParameterSelector(id, 'type')
    const idParameters = props.heapControl.getIdParameters(id, {})
    const typeParameters = props.heapControl.getTypeParameters(languageType, {})
    const defaultNodeNames = Object.entries(modules)
        .filter(([, mod]) => mod.defaults.has(type))
        .map(([name]) => name)
    const supportedNodeNames = Object.entries(modules)
        .filter(([, mod]) => mod.supported.has(type))
        .map(([name]) => name)
    const nodeName = (parameterSelector === 'id'
        ? props.heapControl.getIdNodeName(id, defaultNodeNames[0])
        : props.heapControl.getTypeNodeName(languageType, defaultNodeNames[0])) as keyof typeof modules
    const { Node, NodeParameters } = modules[nodeName]
    targetRefs.current = []
    pathRefs.current = []

    const getLinkedObjDataIds = (id: string, pool: Set<string>, depth: number) => {
        if (depth < 0 || pool.has(id)) return
        pool.add(id)
        props.heapControl.getTargets(id).forEach(({ target }) => getLinkedObjDataIds(target, pool, depth - 1))
        return pool
    }

    const moveWrappers = (delta: { x: number; y: number }, depth: number) => {
        const linkedPool = getLinkedObjDataIds(id, new Set(), depth)
        linkedPool.forEach(id => {
            const position = props.heapControl.getPosition(id, index)
            props.heapControl.setPositionRange(id, [0, props.tracer.heapsData.length], {
                x: position.x + delta.x,
                y: position.y + delta.y
            })
            props.heapControl.callSubscriptions(id)
        })
    }

    const computePathCoordinates = (
        sourcePosition: { x: number; y: number },
        delta: { x: number; y: number },
        targetPosition: { x: number; y: number },
        targetSize: { x: number; y: number }
    ) => {
        const source = { x: sourcePosition.x + delta.x, y: sourcePosition.y + delta.y }
        const target = {
            x: clamp(source.x, targetPosition.x, targetPosition.x + targetSize.x),
            y: clamp(source.y, targetPosition.y, targetPosition.y + targetSize.y)
        }
        const center = { x: lerp(0.5, source.x, target.x), y: lerp(0.5, source.y, target.y) }
        const parallelVector = { x: target.x - source.x, y: target.y - source.y }
        const orthogonalVector = { x: parallelVector.y / 4, y: -parallelVector.x / 4 }
        const control = { x: center.x + orthogonalVector.x, y: center.y + orthogonalVector.y }
        return `M ${source.x},${source.y} Q ${control.x},${control.y} ${target.x},${target.y}`
    }

    React.useLayoutEffect(() => {
        const childRect = childRef.current.getBoundingClientRect()
        const screenSize = { x: childRect.width, y: childRect.height }
        const [svgSize] = svgScreenVectorTransform('toSvg', ref.current, screenSize)
        ref.current.setAttribute('width', svgSize.x.toString())
        ref.current.setAttribute('height', svgSize.y.toString())
        props.heapControl.setSizeRange(id, [index, index], svgSize)
        props.heapControl.callSubscriptions(id)
    })

    React.useLayoutEffect(() => {
        const position = props.heapControl.getPosition(id, index, { x: 0, y: 0 })
        const targets = targetRefs.current.map(({ target, element }) => {
            const rect = element.getBoundingClientRect()
            const screenPosition = { x: rect.left, y: rect.top }
            const screenSize = { x: rect.width, y: rect.height }
            const [elementPosition] = svgScreenPointTransform('toSvg', ref.current, screenPosition)
            const [svgSize] = svgScreenVectorTransform('toSvg', ref.current, screenSize)
            const delta = {
                x: elementPosition.x + svgSize.x / 2 - position.x,
                y: elementPosition.y + svgSize.y / 2 - position.y
            }
            return { target, delta }
        })
        props.heapControl.setTargets(id, targets)
        props.heapControl.callSubscriptions(id)
    })

    React.useLayoutEffect(() => {
        let previousSubscriptionIndex = undefined as number
        const updatePosition = (subscriptionIndex?: number) => {
            if (previousSubscriptionIndex !== undefined && previousSubscriptionIndex === subscriptionIndex) return
            previousSubscriptionIndex = subscriptionIndex
            const position = props.heapControl.getPosition(id, index, { x: 0, y: 0 })
            ref.current.setAttribute('x', position.x.toString())
            ref.current.setAttribute('y', position.y.toString())
        }
        updatePosition()
        props.heapControl.subscribe(id, updatePosition)
    })

    React.useEffect(() => {
        let previousSubscriptionIndex = undefined as number
        const updatePaths = (subscriptionIndex?: number) => {
            if (previousSubscriptionIndex !== undefined && previousSubscriptionIndex === subscriptionIndex) return
            previousSubscriptionIndex = subscriptionIndex
            const targets = props.heapControl.getTargets(id)
            targets.forEach(({ target, delta }, i) => {
                const pathRef = pathRefs.current[i]
                const sourcePosition = props.heapControl.getPosition(id, index)
                const targetPosition = props.heapControl.getPosition(target, index)
                const targetSize = props.heapControl.getSize(target, index)
                const pathCoordinates = computePathCoordinates(sourcePosition, delta, targetPosition, targetSize)
                pathRef.setAttribute('d', pathCoordinates)
            })
        }
        updatePaths()
        props.heapControl.subscribe(id, updatePaths)
        props.heapControl.getTargets(id).forEach(({ target }) => props.heapControl.subscribe(target, updatePaths))
    })

    return (
        <>
            <foreignObject ref={ref} className={classes.container}>
                <Draggable
                    containerProps={{ ref: childRef, className: classes.draggable }}
                    onDrag={(delta, event) => {
                        const [svgDelta] = svgScreenVectorTransform('toSvg', ref.current, delta)
                        const depth = !event.altKey ? 0 : !event.shiftKey ? 1 : Infinity
                        moveWrappers(svgDelta, depth)
                    }}
                >
                    <MenuProvider id={id} className={classes.menuProvider}>
                        <div className={classes.menuProvider}>
                            <Node
                                objData={props.objData}
                                parameters={parameterSelector === 'id' ? idParameters : typeParameters}
                                onTargetRef={(id, target, ref) => targetRefs.current.push({ target, element: ref })}
                            />
                        </div>
                    </MenuProvider>
                </Draggable>
                <Menu id={id}>
                    <Item
                        onClick={args => (
                            props.heapControl.setParameterSelector(id, parameterSelector === 'id' ? 'type' : 'id'),
                            updateThis({})
                        )}
                    >
                        {`using ${parameterSelector} parameters`}
                    </Item>
                    <Separator />
                    <Submenu label='id node'>
                        <Item onClick={args => (props.heapControl.setIdNodeName(id, undefined), updateThis({}))}>
                            reset
                        </Item>
                        {supportedNodeNames.map(nodeName => (
                            <Item onClick={args => (props.heapControl.setIdNodeName(id, nodeName), updateThis({}))}>
                                {nodeName}
                            </Item>
                        ))}
                    </Submenu>
                    <Submenu label='type node'>
                        <Item
                            onClick={args => (
                                props.heapControl.setTypeNodeName(languageType, undefined), props.updateHeap({})
                            )}
                        >
                            reset
                        </Item>
                        {supportedNodeNames.map(nodeName => (
                            <Item
                                onClick={args => (
                                    props.heapControl.setTypeNodeName(languageType, nodeName), props.updateHeap({})
                                )}
                            >
                                {nodeName}
                            </Item>
                        ))}
                    </Submenu>
                    <Separator />
                    <Submenu label='id parameters'>
                        <NodeParameters
                            withReset
                            parameters={idParameters}
                            onChange={(updatedParameters: UnknownParameters) => (
                                props.heapControl.setIdParameters(id, updatedParameters), updateThis({})
                            )}
                        />
                    </Submenu>
                    <Submenu label='type parameters'>
                        <NodeParameters
                            withReset
                            parameters={typeParameters}
                            onChange={(updatedParameters: UnknownParameters) => (
                                props.heapControl.setTypeParameters(languageType, updatedParameters),
                                props.updateHeap({})
                            )}
                        />
                    </Submenu>
                </Menu>
            </foreignObject>
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
                    <polyline className={classes.polyline} points='0 0, 10 4, 0 8' />
                </marker>
            </defs>
            {[...Array(props.objData.objMembers)].map(_ => (
                <path
                    ref={ref => ref && pathRefs.current.push(ref)}
                    className={classes.path}
                    markerEnd='url(#pointer)'
                />
            ))}
        </>
    )
}
