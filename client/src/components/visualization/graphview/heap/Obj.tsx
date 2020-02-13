import React from 'react'
import 'react-contexify/dist/ReactContexify.min.css'
import { MenuProvider, Menu, Item, Separator, Submenu } from 'react-contexify'
import { DefaultState } from '../../../../reducers/Store'
import { Draggable } from '../../../utils/Draggable'
import { GraphData, svgScreenTransformVector, UnknownParameters, Edge } from '../GraphData'
import * as ArrayModule from './shapes/Array'
import * as ColumnModule from './shapes/Column'
import * as FieldModule from './shapes/Field'
import * as MapModule from './shapes/Map'

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
    const shape = props.graphData.getNodeShape(node, defaultShape)
    const parameters = props.graphData.getNodeParameters(node, {})

    const { Shape } = modules[shape as keyof typeof modules]

    React.useLayoutEffect(() => {
        const svg = container$.current.closest('svg')
        const rect = container$.current.getBoundingClientRect()
        const screenSize = { x: rect.width, y: rect.height }
        const [svgSize] = svgScreenTransformVector('toSvg', svg, screenSize)
        node.size = svgSize
    })

    React.useLayoutEffect(() => {
        const svg = container$.current.closest('svg')
        const rect = container$.current.getBoundingClientRect()
        links.current.forEach(({ id: targetId, name, ref$, ...data }) => {
            const refRect = ref$.getBoundingClientRect()
            const screenDelta = { x: refRect.left - rect.left, y: refRect.top - rect.top }
            const screenSize = { x: refRect.width, y: refRect.height }
            const [svgDelta, svgSize] = svgScreenTransformVector('toSvg', svg, screenDelta, screenSize)
            const delta = { x: svgDelta.x + svgSize.x / 2, y: svgDelta.y + svgSize.y / 2 }
            props.graphData.pushEdge(id, name, { ...data, from: { self: true, delta }, to: { targetId, mode: 'near' } })
        })
    })

    React.useLayoutEffect(() => props.graphData.callSubscriptions(id))

    return (
        <Draggable
            props={{
                ref: container$,
                className: classes.container,
                onDoubleClick: event => {
                    const direction = event.altKey ? 'vertical' : 'horizontal'
                    const range = [event.ctrlKey ? 0 : index, props.tracer.steps.length] as const
                    const structure = props.graphData.applyNodeAutoLayout(node, direction, undefined, index, range)
                    props.graphData.setAnimate(true)
                    Object.keys(structure.members).forEach(id => props.graphData.callSubscriptions(id))
                }
            }}
            onDrag={(delta, event) => {
                const svg = container$.current.closest('svg')
                const [svgDelta] = svgScreenTransformVector('toSvg', svg, delta)
                const depth = event.altKey ? Infinity : 0
                const range = [event.ctrlKey ? 0 : index, props.tracer.steps.length] as const
                const movedNodes = props.graphData.moveNodePositions(node, svgDelta, depth, index, range)
                props.graphData.setAnimate(false)
                Object.keys(movedNodes).forEach(id => props.graphData.callSubscriptions(id))
            }}
        >
            <MenuProvider id={id} className={classes.menuProvider}>
                <div className={classes.menuProvider}>
                    <Shape id={id} obj={obj} parameters={parameters} onLink={link => links.current.push(link)} />
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
        </Menu>
    )
}
