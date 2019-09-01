import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { Item, Menu, MenuProvider, Separator, Submenu } from 'react-contexify'
import { colors } from '../../../colors'
import { State } from '../../../reducers/Store'
import { ObjData } from '../../../reducers/tracer'
import { Draggable, svgScreenPointTransform, svgScreenVectorTransform } from '../../../Utils'
import * as ArrayComponents from './Array'
import { HeapControl } from './Heap'

import 'react-contexify/dist/ReactContexify.min.css'

const classes = {
    container: cn(css({ cursor: 'move' /*, transition: 'x 0.1s ease-out, y 0.1s ease-out' */ })),
    draggable: cn('d-flex position-absolute', css({ userSelect: 'none' })),
    path: cn(),
    menuProvider: cn('d-flex'),
    selected: cn(css({ background: colors.blue.lighter }))
}

// const getNodeComponent = (obj: ObjData, node: Node, typeNode: Node) => {
//     if (node.name != undefined) return { ...components[node.name as keyof typeof components], node }
//     if (typeNode.name != undefined) return { ...components[typeNode.name as keyof typeof components], node: typeNode }
//     const defaultModule = Object.entries(components)
//         .filter(([, node]) => node.isDefault(obj))
//         .map(([, node]) => node)[0]

//     return { ...defaultModule, node }
// }

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
    const pathRefs = React.useRef<SVGLineElement[]>([])
    const updateThis = React.useState({})[1]
    const { id, languageType } = props.objData
    const { index } = props.tracer
    const parameterSelector = props.heapControl.getParameterSelector(id, 'type')
    const idParameters = props.heapControl.getIdParameters(id, {})
    const typeParameters = props.heapControl.getTypeParameters(id, {})
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
            props.heapControl.setPositionRange(id, [index, index], { x: position.x + delta.x, y: position.y + delta.y })
            props.heapControl.callSubscriptions(id)
        })
    }

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
        const targets = targetRefs.current.map(({ target, element }) => {
            const rect = element.getBoundingClientRect()
            const screenPosition = { x: rect.left, y: rect.top }
            const screenSize = { x: rect.width, y: rect.height }
            const [svgPosition] = svgScreenPointTransform('toSvg', ref.current, screenPosition)
            const [svgSize] = svgScreenVectorTransform('toSvg', ref.current, screenSize)
            const delta = { x: svgPosition.x + svgSize.x / 2, y: svgPosition.y + svgSize.y / 2 }
            return { target, delta }
        })
        props.heapControl.setTargets(id, targets)
        props.heapControl.callSubscriptions(id)
    })

    // React.useEffect(() => {
    //     let previousSubscriptionIndex = undefined as number
    //     const updatePaths = (subscriptionIndex?: number) => {
    //         if (subscriptionIndex !== undefined && previousSubscriptionIndex === subscriptionIndex)
    //             return (previousSubscriptionIndex = subscriptionIndex)

    //         const targets = props.heapControl.getTargets(id)
    //         targets.forEach(({ target, delta: element }, i) => {
    //             const targetBox = props.heapControl.getContainer(target).getBBox() // imprecise position, but has size
    //             const targetLeftTop = props.heapControl.getPosition(target, index)
    //             const targetPositionX =
    //                 sourcePositionX <= targetLeftTop.x
    //                     ? targetLeftTop.x
    //                     : sourcePositionX >= targetLeftTop.x + targetBox.width
    //                     ? targetLeftTop.x + targetBox.width
    //                     : sourcePositionX
    //             const targetPositionY =
    //                 sourcePositionY <= targetLeftTop.y
    //                     ? targetLeftTop.y
    //                     : sourcePositionY >= targetLeftTop.x + targetBox.height
    //                     ? targetLeftTop.y + targetBox.height
    //                     : sourcePositionY

    //             pathRefs.current[i].setAttribute('x1', sourcePositionX.toString())
    //             pathRefs.current[i].setAttribute('y1', sourcePositionY.toString())
    //             pathRefs.current[i].setAttribute('x2', targetPositionX.toString())
    //             pathRefs.current[i].setAttribute('y2', targetPositionY.toString())
    //         })
    //     }
    //     updatePaths()
    //     props.heapControl.subscribe(id, updatePaths)
    //     props.heapControl.getTargets(id).forEach(({ target }) => props.heapControl.subscribe(target, updatePaths))
    // })

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
                        <ArrayComponents.Node
                            objData={props.objData}
                            parameters={parameterSelector === 'id' ? idParameters : typeParameters}
                            onTargetRef={(id, target, ref) => targetRefs.current.push({ target, element: ref })}
                        />
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
                    <Submenu label='id parameters'>
                        <ArrayComponents.NodeParameters
                            withReset
                            parameters={idParameters}
                            onChange={updatedParameters => (
                                props.heapControl.setIdParameters(id, updatedParameters), updateThis({})
                            )}
                        />
                    </Submenu>
                    <Submenu label='type parameters'>
                        <ArrayComponents.NodeParameters
                            withReset
                            parameters={typeParameters}
                            onChange={updatedParameters => (
                                props.heapControl.setTypeParameters(languageType, updatedParameters),
                                props.updateHeap({})
                            )}
                        />
                    </Submenu>
                </Menu>
            </foreignObject>
            {[...Array(props.objData.objMembers)].map(_ => (
                <line ref={ref => pathRefs.current.push(ref)} className={classes.path} stroke='black'></line>
            ))}
        </>
    )
}
