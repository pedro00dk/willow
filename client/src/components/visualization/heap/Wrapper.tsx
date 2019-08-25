import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { Item, Menu, MenuProvider, Separator, Submenu } from 'react-contexify'
import { colors } from '../../../colors'
import { State } from '../../../reducers/Store'
import { ObjData } from '../../../reducers/tracer'
import * as ArrayComponents from './Array'

import 'react-contexify/dist/ReactContexify.min.css'
import { Link, Node, Position, VisualizationProperties } from './Heap'
import { svgScreenPointTransform, svgScreenVectorTransform } from './SvgView'

const classes = {
    foreignObject: cn(css({ cursor: 'move' })),
    container: cn('d-flex position-absolute', css({ userSelect: 'none' })),
    menuProvider: cn('d-flex'),
    selected: cn(css({ background: colors.blue.lighter }))
}

const components = {
    array: ArrayComponents
}

const getNodeComponent = (obj: ObjData, node: Node, typeNode: Node) => {
    if (node.name != undefined) return { ...components[node.name as keyof typeof components], node }
    if (typeNode.name != undefined) return { ...components[typeNode.name as keyof typeof components], node: typeNode }
    const defaultModule = Object.entries(components)
        .filter(([, node]) => node.isDefault(obj))
        .map(([, node]) => node)[0]

    return { ...defaultModule, node }
}

const getLinked = (current: string, links: { [reference: string]: Link }, pool: Set<string>, depth: number) => {
    if (depth === 0 || pool.has(current)) return
    pool.add(current)
    links[current].forEach(({ target }) => getLinked(target, links, pool, depth - 1))
    return pool
}

const onReposition = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    tracer: State['tracer'],
    root: string,
    rect: ClientRect | DOMRect,
    positions: { [reference: string]: Position },
    links: { [reference: string]: Link }
) => {
    const data = tracer.groupMapsData[tracer.index][root]
    if (!data) return

    const anchor = positions[root].position
    const space = rect.width - positions[root].position.x
    const increment = space / data.depth
    let distance = 0
    positions[data.base].setPosition({ ...anchor, x: anchor.x + increment * distance })
    const moved = new Set([data.base])
    const previousLevel = new Set([data.base])
    distance++
    while (previousLevel.size > 0) {
        const pool = [...previousLevel]
            .map(reference => {
                const x = getLinked(reference, links, new Set(), 2)
                return x
            })
            .reduce((acc, n) => {
                n.forEach(reference => acc.add(reference))
                return acc
            }, new Set<string>())
        pool.forEach(reference => (!data.members.has(reference) ? pool.delete(reference) : undefined))
        moved.forEach(reference => pool.delete(reference))
        pool.forEach(reference => moved.add(reference))
        pool.forEach(reference => positions[reference].setPosition({ ...anchor, x: anchor.x + increment * distance }))
        previousLevel.clear()
        pool.forEach(reference => previousLevel.add(reference))
        distance++
    }
}

const onDrag = (
    event: React.DragEvent<HTMLDivElement>,
    anchor: { x: number; y: number },
    root: string,
    rect: ClientRect | DOMRect,
    positions: { [reference: string]: Position },
    links: { [reference: string]: Link }
) => {
    if (event.clientX === 0 && event.clientY === 0) return
    const pool = getLinked(root, links, new Set(), !event.ctrlKey ? 1 : !event.shiftKey ? 2 : Infinity)
    pool.forEach(reference => {
        const position = positions[reference]
        position.setPosition({
            x: Math.max(10, Math.min(position.position.x + (event.clientX - anchor.x), rect.width - 10)),
            y: Math.max(10, Math.min(position.position.y + (event.clientY - anchor.y), rect.height - 10))
        })
    })
}

export const Wrapper = (props: {
    tracer: State['tracer']
    objData: ObjData
    visualizationProperties: VisualizationProperties
    updateAll: React.Dispatch<{}>
    // rect: ClientRect | DOMRect
    // scale: { value: number }
    // positions: { [reference: string]: Position }
    // nodes: { [reference: string]: Node }
    // typeNodes: { [type: string]: Node }
    // links: { [reference: string]: Link }
    // position: Position
    // node: Node
    // typeNode: Node
    // link: Link
    // updateNodes: React.Dispatch<{}>
}) => {
    console.log('wrapper')
    const ref = React.useRef<SVGForeignObjectElement>()
    const childRef = React.useRef<HTMLDivElement>()
    const updateThis = React.useState({})[1]
    const box = React.useRef<DOMRect>()
    const click = React.useRef(false)

    const { reference, languageType } = props.objData
    const positions = props.visualizationProperties.positions[reference]
        ? props.visualizationProperties.positions[reference]
        : (props.visualizationProperties.positions[reference] = [])
    const position = positions[props.tracer.index]
        ? positions[props.tracer.index]
        : (positions[props.tracer.index] = { x: 0, y: 0 })
    const parameterSelector = props.visualizationProperties.parameterSelector[reference]
        ? props.visualizationProperties.parameterSelector[reference]
        : (props.visualizationProperties.parameterSelector[reference] = 'type')
    const objParameters = props.visualizationProperties.objParameters[reference]
        ? props.visualizationProperties.objParameters[reference]
        : (props.visualizationProperties.objParameters[reference] = {})
    const typeParameters = props.visualizationProperties.typeParameters[languageType]
        ? props.visualizationProperties.typeParameters[languageType]
        : (props.visualizationProperties.typeParameters[languageType] = {})

    React.useLayoutEffect(() => {
        const childRect = childRef.current.getBoundingClientRect()
        const screenSize = { x: childRect.width, y: childRect.height }
        const [svgSize] = svgScreenVectorTransform('toSvg', ref.current, screenSize)
        ref.current.setAttribute('width', svgSize.x.toString())
        ref.current.setAttribute('height', svgSize.y.toString())
        box.current = ref.current.getBBox()
    })

    return (
        <foreignObject
            ref={ref}
            x={position.x}
            y={position.y}
            width={0}
            height={0}
            className={classes.foreignObject}
            onMouseDown={event => ((click.current = true), event.stopPropagation())}
            onMouseUp={event => (click.current = false)}
            onMouseLeave={event => (click.current = false)}
            onMouseMove={event => {
                if (!click.current) return
                const screenDeltaVector = { x: event.movementX, y: event.movementY }
                const [svgDeltaVector] = svgScreenVectorTransform('toSvg', ref.current, screenDeltaVector)
                position.x += svgDeltaVector.x
                position.y += svgDeltaVector.y
                ref.current.setAttribute('x', position.x.toString())
                ref.current.setAttribute('y', position.y.toString())
            }}
        >
            <div ref={childRef} className={classes.container}>
                <MenuProvider id={reference} className={classes.menuProvider}>
                    <ArrayComponents.Node
                        objData={props.objData}
                        parameters={parameterSelector === 'obj' ? objParameters : typeParameters}
                    />
                </MenuProvider>
            </div>
            <Menu id={reference}>
                <Item
                    onClick={args => (
                        (props.visualizationProperties.parameterSelector[reference] =
                            parameterSelector === 'obj' ? 'type' : 'obj'),
                        updateThis({})
                    )}
                >
                    {`using ${parameterSelector === 'obj' ? 'object' : 'type'} parameters`}
                </Item>
                <Separator />
                <Submenu label='object parameters'>
                    <ArrayComponents.NodeParameters
                        withReset
                        parameters={objParameters}
                        onChange={updatedParameters => (
                            (props.visualizationProperties.objParameters[reference] = updatedParameters), updateThis({})
                        )}
                    />
                </Submenu>
                <Submenu label='type parameters'>
                    <ArrayComponents.NodeParameters
                        withReset
                        parameters={typeParameters}
                        onChange={updatedParameters => (
                            (props.visualizationProperties.typeParameters[languageType] = updatedParameters),
                            props.updateAll({})
                        )}
                    />
                </Submenu>
            </Menu>
        </foreignObject>
    )

    // const updateNode = React.useState<{}>()[1]
    // const [position, setPosition] = React.useState<{ x: number; y: number }>(props.position.position)
    // const dragAnchor = React.useRef({ x: 0, y: 0 })

    // const { Node, Parameters, node } = getNodeComponent(props.obj, props.node, props.typeNode)

    // return (
    //     <div
    //         className={classes.container}
    //         style={{
    //             left: position.x,
    //             top: position.y,
    //             transformOrigin: '0 0 0',
    //             transform: `scale(${props.scale.value}) translate(-50%, -50%)`
    //         }}
    //         onDoubleClick={event =>
    //             onReposition(event, props.tracer, props.obj.reference, props.rect, props.positions, props.links)
    //         }
    //         draggable
    //         onDragStart={event => (dragAnchor.current = { x: event.clientX, y: event.clientY })}
    //         onDrag={event => {
    //             onDrag(event, dragAnchor.current, props.obj.reference, props.rect, props.positions, props.links)
    //             dragAnchor.current = { x: event.clientX, y: event.clientY }
    //         }}
    //     >
    //         <MenuProvider className={classes.nodeContainer} id={props.obj.reference}>
    //             <Node objData={props.obj} node={node} link={props.link} />
    //             b: {props.tracer.groupMapsData[props.tracer.index][props.obj.reference].base}-{' '}
    //             {props.tracer.groupMapsData[props.tracer.index][props.obj.reference].type}
    //         </MenuProvider>
    //         <NodeMenu
    //             obj={props.obj}
    //             node={props.node}
    //             typeNode={props.typeNode}
    //             onNodeChange={() => updateNode({})}
    //             onTypeNodeChange={() => props.updateNodes({})}
    //             Parameters={Parameters}
    //         />
    //     </div>
    // )
}
