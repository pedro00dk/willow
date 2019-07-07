import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { Item, Menu, MenuProvider, Separator, Submenu } from 'react-contexify'
import { colors } from '../../../colors'
import { State } from '../../../reducers/Store'
import { ObjNode } from '../../../reducers/tracer'
import * as ArrayNode from './ArrayNode'
import * as BarsNode from './BarsNode'
import * as FieldNode from './FieldNode'
import * as MapNode from './MapNode'

import 'react-contexify/dist/ReactContexify.min.css'
import { Link, Node, Position } from './Heap'

const classes = {
    container: cn('position-absolute', 'd-inline-flex', css({ transition: 'left 0.1s, top 0.1s, transform 0.1s' })),
    nodeContainer: cn('d-inline-flex'),
    selected: cn(css({ background: colors.blue.lighter }))
}

const nodeModules = {
    array: ArrayNode,
    bars: BarsNode,
    field: FieldNode,
    map: MapNode
}

const getNodeComponent = (obj: ObjNode, node: Node, typeNode: Node) => {
    if (node.name != undefined) return { ...nodeModules[node.name as keyof typeof nodeModules], node }
    if (typeNode.name != undefined) return { ...nodeModules[typeNode.name as keyof typeof nodeModules], node: typeNode }
    const defaultModule = Object.entries(nodeModules)
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
    const data = tracer.groups[tracer.index][root]
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

export function NodeWrapper(props: {
    tracer: State['tracer']
    obj: ObjNode
    rect: ClientRect | DOMRect
    scale: { value: number }
    positions: { [reference: string]: Position }
    nodes: { [reference: string]: Node }
    typeNodes: { [type: string]: Node }
    links: { [reference: string]: Link }
    position: Position
    node: Node
    typeNode: Node
    link: Link
    updateNodes: React.Dispatch<{}>
}) {
    const updateNode = React.useState<{}>()[1]
    const [position, setPosition] = React.useState<{ x: number; y: number }>(props.position.position)
    const dragAnchor = React.useRef({ x: 0, y: 0 })

    props.position.position.x = position.x = Math.min(Math.max(position.x, 10), props.rect.width - 10)
    props.position.position.y = position.y = Math.min(Math.max(position.y, 10), props.rect.height - 10)
    props.position.setPosition = setPosition
    props.link.length = 0

    const { Node, Parameters, node } = getNodeComponent(props.obj, props.node, props.typeNode)

    return (
        <div
            className={classes.container}
            style={{
                left: position.x,
                top: position.y,
                transformOrigin: '0 0 0',
                transform: `scale(${props.scale.value}) translate(-50%, -50%)`
            }}
            onDoubleClick={event =>
                onReposition(event, props.tracer, props.obj.reference, props.rect, props.positions, props.links)
            }
            draggable
            onDragStart={event => (dragAnchor.current = { x: event.clientX, y: event.clientY })}
            onDrag={event => {
                onDrag(event, dragAnchor.current, props.obj.reference, props.rect, props.positions, props.links)
                dragAnchor.current = { x: event.clientX, y: event.clientY }
            }}
        >
            <MenuProvider className={classes.nodeContainer} id={props.obj.reference}>
                <Node objNode={props.obj} node={node} link={props.link} />
                b: {props.tracer.groups[props.tracer.index][props.obj.reference].base}-{' '}
                {props.tracer.groups[props.tracer.index][props.obj.reference].type}
            </MenuProvider>
            <NodeMenu
                obj={props.obj}
                node={props.node}
                typeNode={props.typeNode}
                onNodeChange={() => updateNode({})}
                onTypeNodeChange={() => props.updateNodes({})}
                Parameters={Parameters}
            />
        </div>
    )
}

function NodeMenu(props: {
    obj: ObjNode
    node: Node
    typeNode: Node
    onNodeChange: () => void
    onTypeNodeChange: () => void
    Parameters: (props: { obj: ObjNode; node: Node; onChange: () => void }) => JSX.Element
}) {
    return (
        <Menu id={props.obj.reference}>
            <Item disabled>
                {props.node.name != undefined
                    ? props.node.name
                    : props.typeNode.name != undefined
                    ? props.typeNode.name
                    : 'default'}
            </Item>
            {([
                ['object', props.node, props.onNodeChange],
                ['type', props.typeNode, props.onTypeNodeChange]
            ] as const).map(([name, node, onChange]) => (
                <React.Fragment key={name}>
                    <Separator />
                    <Submenu label={name}>
                        {node.name != undefined && (
                            <Item
                                onClick={() => {
                                    node.name = undefined
                                    onChange()
                                }}
                            >
                                reset
                            </Item>
                        )}
                        {Object.keys(nodeModules).map(nodeName => (
                            <Item
                                key={nodeName}
                                className={node.name === nodeName ? classes.selected : undefined}
                                onClick={() => {
                                    node.name = nodeName
                                    onChange()
                                }}
                            >
                                {nodeName}
                            </Item>
                        ))}
                    </Submenu>
                    {node.name != undefined && (
                        <Submenu disabled={node.name == undefined} label={`${name} properties`}>
                            <props.Parameters obj={props.obj} node={node} onChange={() => onChange()} />
                        </Submenu>
                    )}
                </React.Fragment>
            ))}
            <Separator />
        </Menu>
    )
}
