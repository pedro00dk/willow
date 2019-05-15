import cn from 'classnames'
import * as React from 'react'
import { State, useRedux } from '../../../reducers/Store'
import { NodeWrapper } from './NodeWrapper'

const classes = {
    container: cn('d-flex', 'overflow-auto', 'w-100 h-100'),
    line: cn('position-absolute', 'p-0 m-0')
}

export type Position = { p: { x: number; y: number }; set: (p: { x: number; y: number }) => void }
export type Node = { name: string; parameters: { [option: string]: unknown } }
export type Link = { ref: HTMLElement; target: string; under: boolean }[]

export function Heap() {
    const heapRef = React.useRef<HTMLElement>(undefined)
    const updateHeap = React.useState<{}>()[1]
    const heapBB = React.useRef<ClientRect | DOMRect>(new DOMRect())
    const scale = React.useRef({ value: 1 })
    const positions = React.useRef<{ [reference: string]: Position }>({})
    const nodes = React.useRef<{ [reference: string]: Node }>({})
    const typeNodes = React.useRef<{ [type: string]: Node }>({})
    const links = React.useRef<{ [reference: string]: Link }>({})
    const { tracer } = useRedux(state => ({ tracer: state.tracer }))

    React.useEffect(() => {
        if (!heapRef.current) return
        const interval = setInterval(() => {
            const newHeapBB = heapRef.current.getBoundingClientRect()
            if (
                heapBB.current.left === newHeapBB.left &&
                heapBB.current.top === newHeapBB.top &&
                heapBB.current.width === newHeapBB.width &&
                heapBB.current.height === newHeapBB.height
            )
                return
            heapBB.current = newHeapBB
            updateHeap({})
        }, 500)
        return () => clearInterval(interval)
    }, [heapRef])

    if (!tracer.available) {
        scale.current = { value: 1 }
        positions.current = {}
        nodes.current = {}
        typeNodes.current = {}
        links.current = {}
    }

    return (
        <div
            ref={ref => (heapRef.current = ref)}
            className={classes.container}
            onWheel={event => {
                const factor = event.deltaY < 0 ? 0.95 : event.deltaY > 0 ? 1.05 : 1
                scale.current.value = Math.max(0.5, Math.min(scale.current.value * factor, 4))
                updateHeap({})
            }}
        >
            {tracer.available && (
                <>
                    <Nodes
                        tracer={tracer}
                        heapBB={heapBB.current}
                        scale={scale.current}
                        positions={positions.current}
                        nodes={nodes.current}
                        typeNodes={typeNodes.current}
                        links={links.current}
                    />
                    <Edges
                        heapBB={heapBB.current}
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
    heapBB: ClientRect | DOMRect
    scale: { value: number }
    positions: { [reference: string]: Position }
    nodes: { [reference: string]: Node }
    typeNodes: { [type: string]: Node }
    links: { [reference: string]: Link }
}) {
    const updateNodes = React.useState<{}>()[1]
    const size = { width: props.heapBB.width, height: props.heapBB.height }

    Object.keys(props.links).forEach(reference => delete props.links[reference])

    if (!props.tracer.available) return <></>

    return (
        <>
            {Object.values(props.tracer.heaps[props.tracer.index]).map(obj => {
                const position = !!props.positions[obj.reference]
                    ? props.positions[obj.reference]
                    : (props.positions[obj.reference] = { p: { x: 0, y: 0 }, set: p => undefined })
                const node = !!props.nodes[obj.reference]
                    ? props.nodes[obj.reference]
                    : (props.nodes[obj.reference] = { name: undefined, parameters: {} })
                const typeNode = !!props.typeNodes[obj.languageType]
                    ? props.typeNodes[obj.languageType]
                    : (props.typeNodes[obj.languageType] = { name: undefined, parameters: {} })
                const link = (props.links[obj.reference] = [] as Link)
                return (
                    <NodeWrapper
                        key={obj.reference}
                        updateNodes={updateNodes}
                        obj={obj}
                        size={size}
                        scale={props.scale}
                        position={position}
                        node={node}
                        typeNode={typeNode}
                        link={link}
                    />
                )
            })}
        </>
    )
}

function Edges(props: {
    heapBB: ClientRect | DOMRect
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
                    const fromX = bb.left + bb.width / 2 - props.heapBB.left
                    const fromY = bb.top + bb.height / 2 - props.heapBB.top
                    const toX = props.positions[target].p.x
                    const toY = props.positions[target].p.y
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
