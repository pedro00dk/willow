import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import { DefaultState } from '../../../../reducers/Store'
import { ObjData } from '../../../../reducers/tracer'
import { GraphController } from '../GraphController'
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
    container: cn('d-flex position-absolute', css({ userSelect: 'none' }))
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
    const { id, type, languageType } = props.objData
    const { index } = props.tracer
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

    const updatePosition = (delta: { x: number; y: number }, depth: number, update: 'all' | 'from' | 'single') => {
        console.log(depth, update)
        const linked = getLinked(props.objData, depth)
        console.log(linked)
        linked.forEach(id => {
            const position = props.controller.getPosition(id, index)
            const updateRange = [
                update === 'all' ? 0 : index,
                update === 'single' ? index : props.tracer.heapsData.length
            ] as [number, number]
            props.controller.setPositionRange(id, updateRange, {
                x: position.x + delta.x,
                y: position.y + delta.y
            })
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
            props={{ ref: r => ((ref.current = r), updateSize(), updateTargets()), className: classes.container }}
            onDrag={(delta, event) => {
                const [svgDelta] = svgScreenTransformVector('toSvg', getSvgElement(), delta)
                const depth = !event.altKey ? 0 : Infinity
                const update = !event.ctrlKey ? 'from' : !event.altKey ? 'all' : 'single'
                updatePosition(svgDelta, depth, update)
            }}
        >
            <Node
                objData={props.objData}
                parameters={parameters}
                onTargetRef={(id, target, spanRef) => targets.current.push([target, spanRef])}
            />
            {/* <MenuProvider id={id} className={classes.menuProvider}>
                <div
                    className={classes.menuProvider}
                    onDoubleClick={event => {
                        const update = !event.ctrlKey ? 'from' : !event.altKey ? 'all' : 'single'
                        repositionWrappers(update)
                    }}
                >
                </div>
            </MenuProvider> */}
        </Draggable>
    )
}
