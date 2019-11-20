import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import 'react-contexify/dist/ReactContexify.min.css'
import { MenuProvider, Menu, Item, Separator, Submenu } from 'react-contexify'
import { DefaultState } from '../../../../reducers/Store'
import { ObjData } from '../../../../reducers/tracer'
import { GraphController, UnknownParameters } from '../GraphController'
import { Draggable } from '../../../Draggable'
import { svgScreenTransformVector, svgElementContext } from '../SvgView'
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
    objData: ObjData
    tracer: DefaultState['tracer']
    controller: GraphController
    updateGraph: React.Dispatch<{}>
}) => {
    const ref = React.useRef<HTMLDivElement>()
    const targets = React.useRef<[string, HTMLSpanElement][]>()
    targets.current = []
    const getSvgElement = React.useContext(svgElementContext)
    const updateObj = React.useState({})[1]
    const { id, type, languageType } = props.objData
    const { index, groupsData } = props.tracer
    const selector = props.controller.getSelector(id, 'type')
    const parameters =
        selector === 'id' ? props.controller.getParameters(id, {}) : props.controller.getTypeParameters(id, {})
    const defaultNode = Object.entries(modules)
        .filter(([, mod]) => mod.defaults.has(type))
        .map(([name]) => name)[0]
    const supportedNodeNames = Object.entries(modules)
        .filter(([, mod]) => mod.supported.has(type))
        .map(([name]) => name)

    const nodeName =
        selector === 'id'
            ? props.controller.getNodeName(id, defaultNode)
            : props.controller.getTypeNodeName(languageType, defaultNode)

    const { Node, NodeParameters } = modules[nodeName as keyof typeof modules]

    const getLinked = (objData: ObjData, depth = 0, pool = new Set<string>()) => {
        if (depth < 0 || pool.has(objData.id)) return pool
        pool.add(objData.id)
        objData.members
            .filter(member => typeof member === 'object')
            .forEach(member => getLinked(member.value as ObjData, depth - 1, pool))
        return pool
    }

    const updatePosition = (delta: { x: number; y: number }, depth: number, update: 'from' | 'all') => {
        getLinked(props.objData, depth).forEach(id => {
            const position = props.controller.getPosition(id, index)
            const range = [update === 'all' ? 0 : index, props.tracer.heapsData.length] as [number, number]
            props.controller.setPositionRange(id, range, { x: position.x + delta.x, y: position.y + delta.y })
            props.controller.callSubscriptions(id)
        })
    }

    const autoLayout = (horizontal: boolean, update: 'from' | 'all') => {
        const groupData = groupsData[index]
        const structure = groupData[id]
        if (!structure || structure.type === 'unknown') return
        const positionAnchor = props.controller.getPosition(id, index)
        const sizeAnchor = props.controller.getSize(id, index)
        const increment = { x: sizeAnchor.x * 1.5, y: sizeAnchor.y * 1.5 }
        const range = [update === 'all' ? 0 : index, props.tracer.heapsData.length] as [number, number]

        const postLayout = (
            objData: ObjData,
            depth = { x: 0, y: 0 },
            positions: { [id: string]: { x: number; y: number } } = {}
        ) => {
            if (positions[objData.id]) return
            positions[objData.id] = { x: 0, y: 0 }

            const newDepth = { ...depth }
            const members = objData.members.filter(
                member => typeof member.value === 'object' && structure.members.has(member.value.id)
            )
            members.forEach(member => {
                const [, updatedDepth] = postLayout(
                    member.value as ObjData,
                    { x: newDepth.x + Number(horizontal), y: newDepth.y + Number(!horizontal) },
                    positions
                )
                newDepth.x = updatedDepth.x
                newDepth.y = updatedDepth.y
            })
            const isLeaf = horizontal ? newDepth.y === depth.y : newDepth.x === depth.x
            positions[objData.id].x =
                positionAnchor.x + increment.x * (horizontal || isLeaf ? depth.x : (depth.x + newDepth.x - 1) / 2)
            positions[objData.id].y =
                positionAnchor.y + increment.y * (!horizontal || isLeaf ? depth.y : (depth.y + newDepth.y - 1) / 2)
            return [
                positions,
                { x: newDepth.x + (horizontal || !isLeaf ? -1 : 1), y: newDepth.y + (!horizontal || !isLeaf ? -1 : 1) }
            ] as const
        }

        Object.entries(postLayout(props.tracer.heapsData[index][structure.base])[0]).forEach(([id, position]) => {
            props.controller.setPositionRange(id, range, position)
            props.controller.callSubscriptions(id)
        })
    }

    const updateSize = () => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const screenSize = { x: rect.width, y: rect.height }
        const [svgSize] = svgScreenTransformVector('toSvg', getSvgElement(), screenSize)
        props.controller.setSizeRange(id, [index, index], svgSize)
        props.controller.callSubscriptions(id)
    }

    const updateTargets = () => {
        if (!ref.current) return
        targets.current.forEach(([target, spanRef]) => {
            const rect = ref.current.getBoundingClientRect()
            const spanRect = spanRef.getBoundingClientRect()
            const screenDelta = { x: spanRect.left - rect.left, y: spanRect.top - rect.top }
            const screenSize = { x: spanRect.width, y: spanRect.height }
            const [svgDelta, svgSize] = svgScreenTransformVector('toSvg', getSvgElement(), screenDelta, screenSize)
            const delta = { x: svgDelta.x + svgSize.x / 2, y: svgDelta.y + svgSize.y / 2 }
            props.controller.getTargets(id).push({ target, delta })
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
                const [svgDelta] = svgScreenTransformVector('toSvg', getSvgElement(), delta)
                const depth = !event.altKey ? 0 : Infinity
                const update = !event.ctrlKey ? 'from' : 'all'
                updatePosition(svgDelta, depth, update)
            }}
        >
            <MenuProvider id={id} className={classes.menuProvider}>
                <div className={classes.menuProvider}>
                    <Node
                        objData={props.objData}
                        parameters={parameters}
                        onTargetRef={(id, target, spanRef) => targets.current.push([target, spanRef])}
                    />
                </div>
            </MenuProvider>
            <Menu id={id}>
                <Item
                    onClick={args => (
                        props.controller.setSelector(id, selector === 'id' ? 'type' : 'id'), updateObj({})
                    )}
                >
                    {`using ${selector} parameters`}
                </Item>
                <Separator />
                <Submenu label='node'>
                    <Item onClick={args => (props.controller.setNodeName(id, undefined), updateObj({}))}>reset</Item>
                    {supportedNodeNames.map((nodeName, i) => (
                        <Item
                            key={i}
                            onClick={args =>
                                selector === 'id'
                                    ? (props.controller.setNodeName(id, nodeName), updateObj({}))
                                    : (props.controller.setTypeNodeName(languageType, nodeName), props.updateGraph({}))
                            }
                        >
                            {nodeName}
                        </Item>
                    ))}
                </Submenu>
                <Separator />
                <Submenu label='parameters'>
                    <NodeParameters
                        objData={props.objData}
                        withReset
                        parameters={parameters}
                        onChange={(updatedParameters: UnknownParameters) =>
                            selector === 'id'
                                ? (props.controller.setParameters(id, updatedParameters), updateObj({}))
                                : (props.controller.setTypeParameters(languageType, updatedParameters),
                                  props.updateGraph({}))
                        }
                    />
                </Submenu>
            </Menu>
        </Draggable>
    )
}
