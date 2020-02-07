import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import 'react-contexify/dist/ReactContexify.min.css'
import { MenuProvider, Menu, Item, Separator, Submenu } from 'react-contexify'
import { DefaultState } from '../../../../reducers/Store'
import * as schema from '../../../../schema/schema'
import { GraphData, UnknownParameters } from '../GraphData'
import { Draggable } from '../../../utils/Draggable'
import { svgScreenTransformVector } from '../svg/SvgView'
import * as ArrayModule from './shapes/Array'
import * as BarsModule from './shapes/Bars'
import * as FieldModule from './shapes/Field'
import * as MapModule from './shapes/Map'

const modules = {
    array: ArrayModule,
    bars: BarsModule,
    field: FieldModule,
    map: MapModule
}

const classes = {
    container: cn('d-flex position-absolute', css({ userSelect: 'none' })),
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
    const id = props.id
    const index = props.graphData.getIndex()
    const obj = props.tracer.steps[index].snapshot.heap[id]
    const node = props.graphData.getNode(id)
    node.depth = props.depth
    node.type = obj.lType

    const supportedShapes = Object.entries(modules)
        .filter(([, mod]) => mod.supported.has(obj.gType))
        .map(([name]) => name)

    const defaultShape = Object.entries(modules)
        .filter(([, mod]) => mod.defaults.has(obj.gType))
        .map(([name]) => name)[0]

    const shape = node.shape[node.mode] !== '' ? node.shape[node.mode] : (node.shape[node.mode] = defaultShape)
    const parameters = node.parameters[node.mode]

    const { Node: Shape, NodeParameters: ShapeParameters } = modules[shape as keyof typeof modules]

    React.useLayoutEffect(() => {
        const rect = container$.current.getBoundingClientRect()
        const screenSize = { x: rect.width, y: rect.height }
        const svg = container$.current.closest('svg')
        const [svgSize] = svgScreenTransformVector('toSvg', svg, screenSize)
        props.graphData.setNodeSizes(node, svgSize)
        props.graphData.callSubscriptions(id)
    })

    return (
        <Draggable
            props={{
                ref: container$,
                className: classes.container,
                onDoubleClick: event => {
                    const horizontal = !event.altKey
                    const update = !event.ctrlKey ? 'from' : 'all'
                    // autoLayout(horizontal, update)
                }
            }}
            onDrag={(delta, event) => {
                const svg = container$.current.closest('svg')
                const [svgDelta] = svgScreenTransformVector('toSvg', svg, delta)
                const depth = !event.altKey ? 0 : Infinity
                const update = !event.ctrlKey ? 'from' : 'all'
                // updatePosition(svgDelta, depth, update)
            }}
        >
            {/* <MenuProvider id={id} className={classes.menuProvider}>
                <div className={classes.menuProvider}>
                    <Shape
                        id={id}
                        obj={obj}
                        parameters={parameters}
                        onTarget={(id, target, ref, text) => {
                            // props.graphData.getEdge('', {
                            //     from: { nodeId: id, mode: 'nearest' },
                            //     to: { nodeId: target, mode: 'nearest' },
                            //     text
                            // })
                        }}
                    />
                </div>
            </MenuProvider>
            <Menu id={id}>
                <Item onClick={args => ((node.mode = node.mode === 'own' ? 'type' : 'own'), props.update({}))}>
                    <span title='change mode'>{`using ${node.mode} parameters`}</span>
                </Item>
                <Separator />
                <Submenu label='node'>
                    <Item onClick={args => ((node.shape[node.mode] = ''), props.update({}))}>reset shape</Item>
                    {supportedShapes.map((shape, i) => (
                        <Item key={i} onClick={args => ((node.shape[node.mode] = shape), props.update({}))}>
                            {shape}
                        </Item>
                    ))}
                </Submenu>
                <Separator />
                <Submenu label='parameters'>
                    <ShapeParameters
                        id={id}
                        obj={heap[id]}
                        withReset
                        parameters={parameters}
                        onChange={(updatedParameters: UnknownParameters) => (
                            props.graphData.setNodeParameters(id, updatedParameters), props.update({})
                        )}
                    />
                </Submenu>
            </Menu> */}
        </Draggable>
    )
}
