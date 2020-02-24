import React from 'react'
import 'react-contexify/dist/ReactContexify.min.css'
import { Item, Menu, MenuProvider, Separator, Submenu } from 'react-contexify'
import * as schema from '../../../../schema/schema'
import { Draggable } from '../../../utils/Draggable'
import { Edge, GraphData, layoutParameters, Node, readParameters, svgScreenTransformVector } from '../GraphData'
import { getMemberName, isValueObject } from '../SchemaUtils'
import { Parameters } from './Parameters'
import * as ArrayModule from './shapes/Array'
import * as ColumnModule from './shapes/Column'
import * as FieldModule from './shapes/Field'
import * as MapModule from './shapes/Map'

const classes = {
    container: 'd-flex position-absolute',
    menuProvider: 'd-flex'
}

const modules = {
    array: ArrayModule,
    column: ColumnModule,
    field: FieldModule,
    map: MapModule
}

export const Obj = (props: {
    id: string
    obj: schema.Obj
    node: Node
    graphData: GraphData
    update: React.Dispatch<{}>
}) => {
    const container$ = React.useRef<HTMLDivElement>()
    const references = React.useRef<{ id: string; name: string; ref$: HTMLSpanElement; edge: Partial<Edge> }[]>()
    references.current = []
    const previousIndex = React.useRef(undefined)
    const previousMembers = React.useRef<{ [id: string]: schema.Member }>({})

    const defaultShape = React.useMemo(() => {
        return Object.entries(modules).reduce(
            (acc, [name, mod]) => acc ?? (mod.defaults.has(props.obj.gType) ? name : acc),
            undefined as string
        )
    }, [props.obj.gType])
    const shape = props.graphData.getNodeShape(props.node) ?? defaultShape
    const parameters = props.graphData.getNodeParameters(props.node)

    const { Shape } = modules[shape as keyof typeof modules]

    React.useLayoutEffect(() => {
        const svg = container$.current.closest('svg')
        const rect = container$.current.getBoundingClientRect()
        const screenSize = { x: rect.width, y: rect.height }
        const [svgSize] = svgScreenTransformVector('toSvg', svg, true, screenSize)
        props.node.size = svgSize
    })

    React.useLayoutEffect(() => {
        const svg = container$.current.closest('svg')
        const rect = container$.current.getBoundingClientRect()
        references.current.forEach(({ id: target, name, ref$, edge }) => {
            const refRect = ref$.getBoundingClientRect()
            const screenDelta = { x: refRect.left - rect.left, y: refRect.top - rect.top }
            const screenSize = { x: refRect.width, y: refRect.height }
            const [svgDelta, svgSize] = svgScreenTransformVector('toSvg', svg, true, screenDelta, screenSize)
            const delta = { x: svgDelta.x + svgSize.x / 2, y: svgDelta.y + svgSize.y / 2 }
            props.graphData.pushEdge(props.node.id, name, { ...edge, from: { delta }, target, to: { mode: 'near' } })
        })
    })

    React.useLayoutEffect(() => props.graphData.callSubscriptions(props.node.id))

    // TODO make better members and previousMembers across shapes
    React.useEffect(() => {
        if (props.graphData.getIndex() === previousIndex.current) return
        previousIndex.current = props.graphData.getIndex()
        previousMembers.current = Object.fromEntries(props.obj.members.map(member => [getMemberName(member), member]))
    })

    // TODO implement better strategy to preserve structure root position
    React.useEffect(() => {
        const layout = readParameters(props.node.layout.parameters, layoutParameters)
        const member = previousMembers.current[layout.member]
        if (!layout.automatic || !member || !isValueObject(member.value)) return
        const node = props.graphData.getNode(member.value[0])
        const baseNode = props.graphData.findStructureBaseNode(node)
        const position = props.node.layout.position ?? props.graphData.getNodePosition(baseNode)
        props.node.layout.position = position

        const structure = props.graphData.applyStructureLayout(
            node,
            position,
            layout.direction as any,
            undefined,
            undefined,
            undefined,
            'override'
        )
        props.graphData.setAnimate(true)
        props.graphData.subscribe(
            baseNode.id,
            () => (props.node.layout.position = props.graphData.getNodePosition(baseNode))
        )
        Object.values(structure.members).forEach(node => props.graphData.callSubscriptions(node.id))
    })

    return (
        <Draggable
            props={{
                ref: container$,
                className: classes.container,
                onDoubleClick: event => {
                    const direction = !event.altKey ? 'horizontal' : 'vertical'
                    const mode = !event.ctrlKey ? 'available' : !event.shiftKey ? 'override' : 'all'
                    const structure = props.graphData.applyStructureLayout(
                        props.node,
                        undefined,
                        direction,
                        undefined,
                        undefined,
                        undefined,
                        mode
                    )
                    props.graphData.setAnimate(true)
                    Object.values(structure.members).forEach(node => props.graphData.callSubscriptions(node.id))
                }
            }}
            onDrag={(event, delta) => {
                const svg = container$.current.closest('svg')
                const [svgDelta] = svgScreenTransformVector('toSvg', svg, false, delta)
                const depth = event.altKey ? Infinity : 0
                const mode = !event.ctrlKey ? 'available' : !event.shiftKey ? 'override' : 'all'
                const movedNodes = props.graphData.moveNodePositions(props.node, depth, svgDelta, undefined, mode)
                props.graphData.setAnimate(false)
                Object.values(movedNodes).forEach(node => props.graphData.callSubscriptions(node.id))
            }}
        >
            <MenuProvider id={props.node.id} className={classes.menuProvider}>
                <div className={classes.menuProvider}>
                    <Shape
                        id={props.node.id}
                        obj={props.obj}
                        parameters={parameters}
                        previousMembers={previousMembers.current}
                        onReference={reference => references.current.push(reference)}
                    />
                </div>
            </MenuProvider>
            <ObjMenu {...props} />
        </Draggable>
    )
}

const ObjMenu = (props: {
    id: string
    obj: schema.Obj
    node: Node
    graphData: GraphData
    update: React.Dispatch<{}>
}) => {
    const [defaultShape, supportedShapes] = React.useMemo(() => {
        return [
            Object.entries(modules).reduce(
                (acc, [name, mod]) => acc ?? (mod.defaults.has(props.obj.gType) ? name : acc),
                undefined as string
            ),
            Object.entries(modules).reduce(
                (acc, [name, mod]) => (mod.supported.has(props.obj.gType) && acc.push(name), acc),
                [] as string[]
            )
        ]
    }, [props.obj.gType])
    const shape = props.graphData.getNodeShape(props.node) ?? defaultShape
    const parameters = props.graphData.getNodeParameters(props.node)

    const { defaultParameters } = modules[shape as keyof typeof modules]

    return (
        <Menu id={props.node.id}>
            <Item onClick={args => ((props.node.mode = props.node.mode === 'own' ? 'type' : 'own'), props.update({}))}>
                <span title='click to change'>{`using ${props.node.mode} parameters`}</span>
            </Item>
            <Separator />
            <Submenu label='shape'>
                <Item onClick={args => (props.graphData.setNodeShape(props.node, undefined), props.update({}))}>
                    {'reset'}
                </Item>
                {supportedShapes.map((shape, i) => (
                    <Item key={i} onClick={args => (props.graphData.setNodeShape(props.node, shape), props.update({}))}>
                        {shape}
                    </Item>
                ))}
            </Submenu>
            <Separator />
            <Submenu label='parameters'>
                <Parameters
                    withReset
                    parameters={parameters}
                    defaults={defaultParameters}
                    obj={props.obj}
                    onChange={parameters => (
                        props.graphData.setNodeParameters(props.node, parameters), props.update({})
                    )}
                />
            </Submenu>
            <Separator />
            <Submenu label='layout'>
                <Parameters
                    withReset
                    parameters={props.node.layout.parameters}
                    defaults={layoutParameters}
                    obj={props.obj}
                    onChange={parameters => ((props.node.layout.parameters = parameters), props.update({}))}
                />
            </Submenu>
        </Menu>
    )
}
