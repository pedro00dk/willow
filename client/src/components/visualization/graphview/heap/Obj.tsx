import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import 'react-contexify/dist/ReactContexify.min.css'
import { MenuProvider, Menu, Item, Separator, Submenu } from 'react-contexify'
import { DefaultState } from '../../../../reducers/Store'
import { Draggable } from '../../../utils/Draggable'
import { GraphData, svgScreenTransformVector, UnknownParameters } from '../GraphData'
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
    const targets = React.useRef<{ targetId: string; ref$: HTMLSpanElement; text: string }[]>()
    targets.current = []

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
        const svg = container$.current.closest('svg')
        const rect = container$.current.getBoundingClientRect()
        const screenSize = { x: rect.width, y: rect.height }
        const [svgSize] = svgScreenTransformVector('toSvg', svg, screenSize)
        props.graphData.setNodeSizes(node, svgSize)
    })

    React.useLayoutEffect(() => {
        const svg = container$.current.closest('svg')
        const rect = container$.current.getBoundingClientRect()
        targets.current.forEach(({ targetId, ref$, text }) => {
            const refRect = ref$.getBoundingClientRect()
            const screenDelta = { x: refRect.left - rect.left, y: refRect.top - rect.top }
            const screenSize = { x: refRect.width, y: refRect.height }
            const [svgDelta, svgSize] = svgScreenTransformVector('toSvg', svg, screenDelta, screenSize)
            const delta = { x: svgDelta.x + svgSize.x / 2, y: svgDelta.y + svgSize.y / 2 }
            props.graphData.pushEdge(id, { from: { delta }, to: { targetId, mode: 'nearest' }, text })
        })
    })

    React.useLayoutEffect(() => props.graphData.callSubscriptions(id))

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
                const depth = event.altKey ? Infinity : 0
                const range = [event.ctrlKey ? 0 : index, props.tracer.steps.length] as const
                props.graphData.moveNodePositions(node, svgDelta, depth, index, range)
                props.graphData.setAnimate(false)
                props.graphData.callSubscriptions(id)
            }}
        >
            <MenuProvider id={id} className={classes.menuProvider}>
                <div className={classes.menuProvider}>
                    <Shape
                        id={id}
                        obj={obj}
                        parameters={parameters}
                        onTarget={(_, targetId, ref$, text) => targets.current.push({ targetId, ref$, text })}
                    />
                </div>
            </MenuProvider>

            {/* <Menu id={id}>
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
