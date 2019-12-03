import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import 'react-contexify/dist/ReactContexify.min.css'
import { MenuProvider, Menu, Item, Separator, Submenu } from 'react-contexify'
import { DefaultState } from '../../../../reducers/Store'
import * as schema from '../../../../schema/schema'
import { GraphData, UnknownParameters } from '../GraphData'
import { Draggable } from '../../../Draggable'
import { svgScreenTransformVector } from '../svg/SvgView'
import * as ArrayModule from './nodes/Array'
import * as BarsModule from './nodes/Bars'
import * as FieldModule from './nodes/Field'
import * as MapModule from './nodes/Map'

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
    obj: schema.Obj
    graphData: GraphData
    forceUpdate: React.Dispatch<{}>
    tracer: DefaultState['tracer']
}) => {
    const ref = React.useRef<HTMLDivElement>()
    const targets = React.useRef<[string, HTMLSpanElement][]>()
    targets.current = []
    const { id, obj, graphData, forceUpdate, tracer } = props
    const index = graphData.getIndex()
    const heap = tracer.steps[index].snapshot.heap
    const { gType, lType } = obj
    const selector = props.graphData.getSelector(id)
    const defaultNode = Object.entries(modules)
        .filter(([, mod]) => mod.defaults.has(gType))
        .map(([name]) => name)[0]
    const supportedNodes = Object.entries(modules)
        .filter(([, mod]) => mod.supported.has(gType))
        .map(([name]) => name)
    const nodeName =
        selector === 'id' ? graphData.getNodeName(id, defaultNode) : graphData.getTypeNodeName(lType, defaultNode)
    const parameters = selector === 'id' ? props.graphData.getParameters(id) : props.graphData.getTypeParameters(lType)
    const { Node, NodeParameters } = modules[nodeName as keyof typeof modules]

    const updatePosition = (delta: { x: number; y: number }, depth: number, update: 'from' | 'all') => {
        const getLinkedObjs = (id: string, obj: schema.Obj, depth = 0, pool = new Set<string>()) => {
            if (depth < 0 || pool.has(id)) return pool
            pool.add(id)
            obj.members
                .filter(member => typeof member.value === 'object')
                .forEach(member => {
                    const memberId = (member.value as [string])[0]
                    const memberObj = heap[memberId]
                    getLinkedObjs(memberId, memberObj, depth - 1, pool)
                })
            return pool
        }
        getLinkedObjs(id, obj, depth).forEach(id => {
            const position = props.graphData.getPosition(id, index)
            const range = [update === 'all' ? 0 : index, props.tracer.steps.length] as [number, number]
            props.graphData.setAnimate(false)
            props.graphData.setPositionRange(id, range, { x: position.x + delta.x, y: position.y + delta.y })
            props.graphData.callSubscriptions(id)
        })
    }

    const updateSize = () => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const screenSize = { x: rect.width, y: rect.height }
        const svg = ref.current.closest('svg')
        const [svgSize] = svgScreenTransformVector('toSvg', svg, screenSize)
        props.graphData.setSizeRange(id, [index, index], svgSize)
        props.graphData.callSubscriptions(id)
    }

    const updateTargets = () => {
        if (!ref.current) return
        targets.current.forEach(([target, spanRef]) => {
            const rect = ref.current.getBoundingClientRect()
            const spanRect = spanRef.getBoundingClientRect()
            const screenDelta = { x: spanRect.left - rect.left, y: spanRect.top - rect.top }
            const screenSize = { x: spanRect.width, y: spanRect.height }
            const svg = ref.current.closest('svg')
            const [svgDelta, svgSize] = svgScreenTransformVector('toSvg', svg, screenDelta, screenSize)
            const delta = { x: svgDelta.x + svgSize.x / 2, y: svgDelta.y + svgSize.y / 2 }
            props.graphData.getTargets(id).push({ target, delta })
        })
    }

    const autoLayout = (horizontal: boolean, update: 'from' | 'all') => {
        const groupData = tracer.groupsData[index]
        const structure = groupData[id]
        if (!structure || structure.type === 'unknown') return
        const positionAnchor = props.graphData.getPosition(id, index)
        const sizeAnchor = props.graphData.getSize(id, index)
        const increment = { x: sizeAnchor.x * 1.5, y: sizeAnchor.y * 1.5 }
        const range = [update === 'all' ? 0 : index, props.tracer.steps.length] as [number, number]

        const postLayout = (
            id: string,
            obj: schema.Obj,
            depth = { x: 0, y: 0 },
            positions: { [id: string]: { x: number; y: number } } = {}
        ) => {
            if (positions[id]) return [positions, depth] as const
            positions[id] = { x: 0, y: 0 }

            const newDepth = { ...depth }
            obj.members
                .filter(member => typeof member.value === 'object' && structure.members.has(member.value[0]))
                .forEach(member => {
                    const [, updatedDepth] = postLayout(
                        (member.value as [string])[0],
                        heap[(member.value as [string])[0]],
                        { x: newDepth.x + Number(horizontal), y: newDepth.y + Number(!horizontal) },
                        positions
                    )
                    newDepth.x = updatedDepth.x
                    newDepth.y = updatedDepth.y
                })
            const isLeaf = horizontal ? newDepth.y === depth.y : newDepth.x === depth.x
            positions[id].x =
                positionAnchor.x + increment.x * (horizontal || isLeaf ? depth.x : (depth.x + newDepth.x - 1) / 2)
            positions[id].y =
                positionAnchor.y + increment.y * (!horizontal || isLeaf ? depth.y : (depth.y + newDepth.y - 1) / 2)
            const finalDepth = {
                x: newDepth.x + (horizontal ? -1 : isLeaf ? 1 : 0),
                y: newDepth.y + (!horizontal ? -1 : isLeaf ? 1 : 0)
            }
            return [positions, finalDepth] as const
        }
        const [positions] = postLayout(structure.base, heap[structure.base])
        const basePosition = positions[structure.base]
        const baseDelta = { x: positionAnchor.x - basePosition.x, y: positionAnchor.y - basePosition.y }
        props.graphData.setAnimate(true)
        Object.entries(positions).forEach(([id, position]) => {
            position.x += baseDelta.x
            position.y += baseDelta.y
            props.graphData.setPositionRange(id, range, position)
            props.graphData.callSubscriptions(id)
        })
    }

    return (
        <Draggable
            props={{
                ref: r => ((ref.current = r), updateSize(), updateTargets()),
                className: classes.container,
                onDoubleClick: event => {
                    const horizontal = !event.altKey
                    const update = !event.ctrlKey ? 'from' : 'all'
                    autoLayout(horizontal, update)
                }
            }}
            onDrag={(delta, event) => {
                const svg = ref.current.closest('svg')
                const [svgDelta] = svgScreenTransformVector('toSvg', svg, delta)
                const depth = !event.altKey ? 0 : Infinity
                const update = !event.ctrlKey ? 'from' : 'all'
                updatePosition(svgDelta, depth, update)
            }}
        >
            <MenuProvider id={id} className={classes.menuProvider}>
                <div className={classes.menuProvider}>
                    <Node
                        id={id}
                        obj={obj}
                        parameters={parameters}
                        onTargetRef={(id, target, spanRef) => targets.current.push([target, spanRef])}
                    />
                </div>
            </MenuProvider>
            <Menu id={id}>
                <Item
                    onClick={args => (
                        props.graphData.setSelector(id, selector === 'id' ? 'type' : 'id'), props.forceUpdate({})
                    )}
                >
                    {`using ${selector} parameters`}
                </Item>
                <Separator />
                <Submenu label='node'>
                    <Item onClick={args => (props.graphData.setNodeName(id, undefined), props.forceUpdate({}))}>
                        reset
                    </Item>
                    {supportedNodes.map((nodeName, i) => (
                        <Item
                            key={i}
                            onClick={args => {
                                selector === 'id'
                                    ? props.graphData.setNodeName(id, nodeName)
                                    : props.graphData.setTypeNodeName(lType, nodeName)
                                props.forceUpdate({})
                            }}
                        >
                            {nodeName}
                        </Item>
                    ))}
                </Submenu>
                <Separator />
                <Submenu label='parameters'>
                    <NodeParameters
                        id={id}
                        obj={obj}
                        withReset
                        parameters={parameters}
                        onChange={(updatedParameters: UnknownParameters) => {
                            selector === 'id'
                                ? props.graphData.setParameters(id, updatedParameters)
                                : props.graphData.setTypeParameters(lType, updatedParameters)
                            props.forceUpdate({})
                        }}
                    />
                </Submenu>
            </Menu>
        </Draggable>
    )
}
