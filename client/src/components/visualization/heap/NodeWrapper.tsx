import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { Item, Menu, MenuProvider, Separator, Submenu } from 'react-contexify'
import { colors } from '../../../colors'
import { Obj } from '../../../reducers/tracer'
import * as ArrayNode from './ArrayNode'
import * as BarsNode from './BarsNode'
import * as FieldNode from './FieldNode'
import * as MapNode from './MapNode'

import 'react-contexify/dist/ReactContexify.min.css'
import { Link, Node, Position } from './Heap'

const classes = {
    container: cn('position-absolute', 'd-inline-flex', css({ transition: 'all 0.1s ease' })),
    nodeContainer: cn('d-inline-flex'),
    selected: cn(css({ background: colors.primaryBlue.lighter }))
}

const nodeModules = {
    array: ArrayNode,
    bars: BarsNode,
    field: FieldNode,
    map: MapNode
}

const getNodeComponent = (obj: Obj, node: Node, typeNode: Node) => {
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
    const draggedPool = new Set<string>()
    getLinked(root, links, draggedPool, !event.ctrlKey ? 1 : !event.shiftKey ? 2 : Infinity)
    draggedPool.forEach(reference => {
        const position = positions[reference]
        position.setPosition({
            x: Math.max(10, Math.min(position.position.x + (event.clientX - anchor.x), rect.width - 10)),
            y: Math.max(10, Math.min(position.position.y + (event.clientY - anchor.y), rect.height - 10))
        })
    })
}

export function NodeWrapper(props: {
    obj: Obj
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
            draggable
            onDragStart={event => (dragAnchor.current = { x: event.clientX, y: event.clientY })}
            onDrag={event => {
                onDrag(event, dragAnchor.current, props.obj.reference, props.rect, props.positions, props.links)
                dragAnchor.current = { x: event.clientX, y: event.clientY }
            }}
        >
            <MenuProvider className={classes.nodeContainer} id={props.obj.reference}>
                <Node obj={props.obj} node={node} link={props.link} />
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
    obj: Obj
    node: Node
    typeNode: Node
    onNodeChange: () => void
    onTypeNodeChange: () => void
    Parameters: (props: { obj: Obj; node: Node; onChange: () => void }) => JSX.Element
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
