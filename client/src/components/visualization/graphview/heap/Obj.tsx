import React from 'react'
import 'react-contexify/dist/ReactContexify.min.css'
import { Item, Menu, MenuProvider, Separator, Submenu } from 'react-contexify'
import { DefaultState } from '../../../../reducers/Store'
import * as schema from '../../../../schema/schema'
import { Draggable } from '../../../utils/Draggable'
import { Edge, GraphData, layoutParameters, svgScreenTransformVector, UnknownParameters } from '../GraphData'
import { getMemberName } from '../SchemaUtils'
import * as ArrayModule from './shapes/Array'
import * as ColumnModule from './shapes/Column'
import * as FieldModule from './shapes/Field'
import * as MapModule from './shapes/Map'
import { Parameters } from './Parameters'

const modules = {
    array: ArrayModule,
    column: ColumnModule,
    field: FieldModule,
    map: MapModule
}

const classes = {
    container: 'd-flex position-absolute',
    menuProvider: 'd-flex'
}

export const Obj = (props: {
    id: string
    depth: number
    graphData: GraphData
    update: React.Dispatch<{}>
    tracer: DefaultState['tracer']
}) => {
    const container$ = React.useRef<HTMLDivElement>()
    const previousIndex = React.useRef(undefined)
    const previousMembers = React.useRef<{ [id: string]: schema.Member }>({})
    const links = React.useRef<({ id: string; name: string; ref$: HTMLSpanElement } & Partial<Edge>)[]>()
    links.current = []

    const id = props.id
    const index = props.graphData.getIndex()
    const obj = props.tracer.steps[index].snapshot.heap[id]
    const node = props.graphData.getNode(id)
    node.depth = props.depth
    node.type = obj.lType
    const defaultShape = Object.entries(modules)
        .filter(([, mod]) => mod.defaults.has(obj.gType))
        .map(([name]) => name)[0]
    const shape = props.graphData.getNodeShape(node) ?? props.graphData.setNodeShape(node, defaultShape)
    const parameters = props.graphData.getNodeParameters(node)

    const { Shape } = modules[shape as keyof typeof modules]

    React.useLayoutEffect(() => {
        const svg = container$.current.closest('svg')
        const rect = container$.current.getBoundingClientRect()
        const screenSize = { x: rect.width, y: rect.height }
        const [svgSize] = svgScreenTransformVector('toSvg', svg, true, screenSize)
        node.size = svgSize
    })

    React.useLayoutEffect(() => {
        const svg = container$.current.closest('svg')
        const rect = container$.current.getBoundingClientRect()
        links.current.forEach(({ id: target, name, ref$, ...data }) => {
            const refRect = ref$.getBoundingClientRect()
            const screenDelta = { x: refRect.left - rect.left, y: refRect.top - rect.top }
            const screenSize = { x: refRect.width, y: refRect.height }
            const [svgDelta, svgSize] = svgScreenTransformVector('toSvg', svg, true, screenDelta, screenSize)
            const delta = { x: svgDelta.x + svgSize.x / 2, y: svgDelta.y + svgSize.y / 2 }
            props.graphData.pushEdge(id, name, { ...data, self: true, from: { delta }, target, to: { mode: 'near' } })
        })
    })

    React.useLayoutEffect(() => props.graphData.callSubscriptions(id))

    React.useEffect(() => {
        // TODO check this implementation
        // console.log('check members', previousIndex.current, previousMembers.current)
        if (previousIndex.current === index) return
        previousIndex.current = index
        previousMembers.current = obj.members.reduce((acc, member) => {
            acc[getMemberName(member)] = member
            return acc
        }, {} as { [name: string]: schema.Member })
        // console.log('update members', previousIndex.current, previousMembers.current)
    })

    return (
        <Draggable
            props={{
                ref: container$,
                className: classes.container,
                onDoubleClick: event => {
                    const dir = !event.altKey ? 'horizontal' : 'vertical'
                    const mode = !event.ctrlKey ? 'available' : !event.shiftKey ? 'override' : 'all'
                    const structure = props.graphData.applyStructureLayout(node, dir, undefined, true, index, mode)
                    props.graphData.setAnimate(true)
                    Object.keys(structure.members).forEach(id => props.graphData.callSubscriptions(id))
                }
            }}
            onDrag={(delta, event) => {
                const svg = container$.current.closest('svg')
                const [svgDelta] = svgScreenTransformVector('toSvg', svg, false, delta)
                const depth = event.altKey ? Infinity : 0
                const mode = !event.ctrlKey ? 'available' : !event.shiftKey ? 'override' : 'all'
                const movedNodes = props.graphData.moveNodePositions(node, depth, svgDelta, index, mode)
                props.graphData.setAnimate(false)
                Object.keys(movedNodes).forEach(id => props.graphData.callSubscriptions(id))
            }}
        >
            <MenuProvider id={id} className={classes.menuProvider}>
                <div className={classes.menuProvider}>
                    <Shape
                        id={id}
                        obj={obj}
                        previousMembers={previousMembers.current}
                        parameters={parameters}
                        onLink={link => links.current.push(link)}
                    />
                </div>
            </MenuProvider>
            <ObjMenu {...props} />
        </Draggable>
    )
}

const ObjMenu = (props: {
    id: string
    graphData: GraphData
    update: React.Dispatch<{}>
    tracer: DefaultState['tracer']
}) => {
    const id = props.id
    const index = props.graphData.getIndex()
    const obj = props.tracer.steps[index].snapshot.heap[id]
    const node = props.graphData.getNode(id)
    const supportedShapes = Object.entries(modules)
        .filter(([, mod]) => mod.supported.has(obj.gType))
        .map(([name]) => name)
    const shape = props.graphData.getNodeShape(node)
    const parameters = props.graphData.getNodeParameters(node)

    const { ShapeParameters } = modules[shape as keyof typeof modules]

    return (
        <Menu id={id}>
            <Item onClick={args => ((node.mode = node.mode === 'own' ? 'type' : 'own'), props.update({}))}>
                <span title='click to change'>{`using ${node.mode} parameters`}</span>
            </Item>
            <Separator />
            <Submenu label='shape'>
                <Item onClick={args => (props.graphData.setNodeShape(node, ''), props.update({}))}>{'reset'}</Item>
                {supportedShapes.map((shape, i) => (
                    <Item key={i} onClick={args => (props.graphData.setNodeShape(node, shape), props.update({}))}>
                        {shape}
                    </Item>
                ))}
            </Submenu>
            <Separator />
            <Submenu label='parameters'>
                <ShapeParameters
                    id={id}
                    obj={obj}
                    withReset
                    parameters={parameters}
                    onChange={(parameters: UnknownParameters) => (
                        props.graphData.setNodeParameters(node, parameters), props.update({})
                    )}
                />
            </Submenu>
            <Separator />
            <Submenu label='layout'>
                <Parameters
                    defaults={layoutParameters}
                    parameters={node.layout}
                    withReset
                    onChange={parameters => ((node.layout = parameters), props.update)}
                ></Parameters>
            </Submenu>
        </Menu>
    )
}
