import cn from 'classnames'
import * as React from 'react'
import { State, useRedux } from '../../../reducers/Store'
import { NodeWrapper } from './NodeWrapper'

const classes = {
    container: cn('d-flex', 'overflow-auto', 'w-100 h-100'),
    line: cn('position-absolute', 'p-0 m-0')
}

export type Position = { position: { x: number; y: number }; setPosition: (p: { x: number; y: number }) => void }
export type Node = { name: string; parameters: { [option: string]: unknown } }
export type Link = { ref: HTMLElement; target: string; under: boolean }[]

export function Heap() {
    const ref = React.useRef<HTMLDivElement>()
    const updateGraph = React.useState<{}>()[1]
    const rect = React.useRef<ClientRect | DOMRect>()
    const scale = React.useRef<{ value: number }>()
    const positions = React.useRef<{ [reference: string]: Position }>()
    const nodes = React.useRef<{ [reference: string]: Node }>()
    const typeNodes = React.useRef<{ [type: string]: Node }>()
    const links = React.useRef<{ [reference: string]: Link }>()
    const { tracer } = useRedux(state => ({ tracer: state.tracer }))

    React.useEffect(() => {
        if (!ref.current) return
        const interval = setInterval(() => {
            const newRect = ref.current.getBoundingClientRect()
            if (
                rect.current.left === newRect.left &&
                rect.current.top === newRect.top &&
                rect.current.width === newRect.width &&
                rect.current.height === newRect.height
            )
                return
            rect.current = newRect
            updateGraph({})
        }, 500)
        return () => clearInterval(interval)
    }, [ref])

    if (!tracer.available) {
        rect.current = new DOMRect()
        scale.current = { value: 1 }
        positions.current = {}
        nodes.current = {}
        typeNodes.current = {}
        links.current = {}
    }

    return (
        <div
            ref={ref}
            className={classes.container}
            onWheel={event => {
                const factor = event.deltaY < 0 ? 0.95 : event.deltaY > 0 ? 1.05 : 1
                scale.current.value = Math.min(Math.max(scale.current.value * factor, 0.5), 4)
                updateGraph({})
            }}
        >
            {tracer.available && (
                <>
                    <Nodes
                        tracer={tracer}
                        rect={rect.current}
                        scale={scale.current}
                        positions={positions.current}
                        nodes={nodes.current}
                        typeNodes={typeNodes.current}
                        links={links.current}
                    />
                    <Edges
                        rect={rect.current}
                        scale={scale.current}
                        positions={positions.current}
                        links={links.current}
                    />
                </>
            )}
        </div>
    )
}

function Nodes(props: {
    tracer: State['tracer']
    rect: ClientRect | DOMRect
    scale: { value: number }
    positions: { [reference: string]: Position }
    nodes: { [reference: string]: Node }
    typeNodes: { [type: string]: Node }
    links: { [reference: string]: Link }
}) {
    const updateNodes = React.useState<{}>()[1]

    Object.keys(props.links).forEach(reference => delete props.links[reference])
    Object.values(props.tracer.heaps[props.tracer.index]).forEach(obj => {
        if (!props.positions[obj.reference])
            props.positions[obj.reference] = { position: { x: 0, y: 0 }, setPosition: undefined }
        if (!props.nodes[obj.reference]) props.nodes[obj.reference] = { name: undefined, parameters: {} }
        if (!props.typeNodes[obj.languageType]) props.typeNodes[obj.languageType] = { name: undefined, parameters: {} }
        props.links[obj.reference] = [] as Link
    })

    return (
        <>
            {Object.values(props.tracer.heaps[props.tracer.index]).map(obj => {
                return (
                    <NodeWrapper
                        key={obj.reference}
                        tracer={props.tracer}
                        obj={obj}
                        rect={props.rect}
                        scale={props.scale}
                        positions={props.positions}
                        nodes={props.nodes}
                        typeNodes={props.typeNodes}
                        links={props.links}
                        position={props.positions[obj.reference]}
                        node={props.nodes[obj.reference]}
                        typeNode={props.typeNodes[obj.languageType]}
                        link={props.links[obj.reference]}
                        updateNodes={updateNodes}
                    />
                )
            })}
        </>
    )
}

function Edges(props: {
    rect: ClientRect | DOMRect
    scale: { value: number }
    positions: { [reference: string]: Position }
    links: { [reference: string]: Link }
}) {
    const updateEdges = React.useState<{}>()[1]
    const thickness = props.scale.value * 2

    React.useEffect(() => {
        const interval = setInterval(() => updateEdges({}), 50)
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            {Object.values(props.links)
                .flatMap(link => link)
                .map(({ ref, target, under }) => {
                    if (!ref) return <></>
                    const bb = ref.getBoundingClientRect()
                    const fromX = bb.left + bb.width / 2 - props.rect.left
                    const fromY = bb.top + bb.height / 2 - props.rect.top
                    const toX = props.positions[target].position.x
                    const toY = props.positions[target].position.y
                    const length = Math.sqrt((fromX - toX) ** 2 + (fromY - toY) ** 2)
                    const angle = Math.atan2(fromY - toY, fromX - toX)
                    const rotationFixedFromX = (fromX + toX - length) / 2
                    const rotationFixedFromY = (fromY + toY - thickness) / 2
                    return (
                        <>
                            <div
                                className={classes.line}
                                style={{
                                    zIndex: under ? -1 : 1,
                                    background: 'linear-gradient(to left, black 30%, transparent 70%)',
                                    lineHeight: thickness,
                                    width: length,
                                    height: thickness,
                                    left: rotationFixedFromX,
                                    top: rotationFixedFromY,
                                    transform: `rotate(${angle}rad)`
                                }}
                            />
                            <div
                                className={classes.line}
                                style={{
                                    zIndex: -1,
                                    background: 'linear-gradient(to left, transparent 30%, black 70%)',
                                    lineHeight: thickness,
                                    width: length,
                                    height: thickness,
                                    left: rotationFixedFromX,
                                    top: rotationFixedFromY,
                                    transform: `rotate(${angle}rad)`
                                }}
                            />
                        </>
                    )
                })}
        </>
    )
}
