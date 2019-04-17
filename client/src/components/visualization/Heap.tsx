import * as React from 'react'
import { ContextMenu, ContextMenuTrigger, MenuItem, SubMenu } from 'react-contextmenu'
import * as protocol from '../../protobuf/protocol'
import { ObjNode } from '../../reducers/debug/heap'
import { useDispatch, useRedux } from '../../reducers/Store'

type Translation = {}

type HeapTransform = {
    svg: { dx: number; dy: number; scale: number }
    nodes: { [reference: string]: { dx: number; dy: number } }
}

export function Heap() {
    const dispatch = useDispatch()
    const heapRef = React.useRef<HTMLDivElement>()
    const [size, setSize] = React.useState({ width: 0, height: 0 })
    const svgClicked = React.useRef(false)
    const selectedNode = React.useRef<string>(undefined)
    const [transform, setTransform] = React.useState<HeapTransform>({ svg: { dx: 0, dy: 0, scale: 1 }, nodes: {} })
    const { debugHeap, debugIndexer, debugResult } = useRedux(state => ({
        debugHeap: state.debugHeap,
        debugIndexer: state.debugIndexer,
        debugResult: state.debugResult
    }))

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (
                !heapRef.current ||
                (heapRef.current.clientWidth === size.width && heapRef.current.clientHeight === size.height)
            )
                return
            setSize({ width: heapRef.current.clientWidth, height: heapRef.current.clientHeight })
        }, 100)
        return () => clearInterval(interval)
    }, [size])

    const fov = !isNaN(size.width / size.height) ? size.width / size.height : 1

    const handleMouse = (event: React.MouseEvent) => {
        if (!selectedNode || !svgClicked.current) return
        console.log('hendlemouse')
        if (selectedNode.current == undefined) {
            console.log('svg')
            setTransform({
                ...transform,
                svg: {
                    ...transform.svg,
                    dx: Math.max(
                        -1,
                        Math.min(transform.svg.dx + (event.movementX * fov) / size.width / transform.svg.scale, 1)
                    ),
                    dy: Math.max(
                        -1,
                        Math.min(transform.svg.dy + event.movementY / size.height / transform.svg.scale, 1)
                    )
                }
            })
        } else {
            const currentTransform = transform.nodes[selectedNode.current]
            const finalTransform = currentTransform ? currentTransform : { dx: 0, dy: 0 }
            setTransform({
                ...transform,
                nodes: {
                    ...transform.nodes,
                    [selectedNode.current]: {
                        dx: Math.max(
                            -4,
                            Math.min(finalTransform.dx + (event.movementX * fov) / size.width / transform.svg.scale, 4)
                        ),
                        dy: Math.max(
                            -4,
                            Math.min(finalTransform.dy + event.movementY / size.height / transform.svg.scale, 4)
                        )
                    }
                }
            })
        }
    }

    const handleWheel = (event: React.WheelEvent) => {
        if (event.deltaY === 0) return
        const zoomFactor = event.deltaY > 0 ? 1.05 : 0.95
        setTransform({
            ...transform,
            svg: {
                ...transform.svg,
                scale: Math.max(0.25, Math.min(transform.svg.scale * zoomFactor, 4))
            }
        })
    }

    return (
        <div ref={heapRef} className='d-flex flex-row align-items-start flex-nowrap overflow-auto h-100 w-100'>
            <svg
                className='h-100 w-100'
                viewBox={`0 0 ${fov} 1`}
                onMouseDown={() => {
                    svgClicked.current = true
                }}
                onMouseUp={() => {
                    svgClicked.current = false
                    selectedNode.current = undefined
                }}
                onMouseLeave={() => {
                    svgClicked.current = false
                    selectedNode.current = undefined
                }}
                onMouseMove={handleMouse}
                onWheel={handleWheel}
            >
                <g transform='translate(0.5, 0.5)'>
                    <g transform={`scale(${transform.svg.scale}) translate(${transform.svg.dx}, ${transform.svg.dy})`}>
                        {debugHeap.heaps.length > 0 &&
                            Object.entries(debugHeap.heaps[debugIndexer]).map(([reference, node]) => {
                                return (
                                    <Node
                                        key={reference}
                                        node={node}
                                        selectedNode={selectedNode}
                                        transform={transform}
                                    />
                                )
                            })}

                        <rect x={-4} y={-4} width={0.05} height={0.05} fill='blue' />
                        <rect x={-4} y={4} width={0.05} height={0.05} fill='blue' />
                        <rect x={4} y={-4} width={0.05} height={0.05} fill='blue' />
                        <rect x={4} y={4} width={0.05} height={0.05} fill='blue' />

                        <rect x={-2} y={-2} width={0.05} height={0.05} fill='green' />
                        <rect x={-2} y={2} width={0.05} height={0.05} fill='green' />
                        <rect x={2} y={-2} width={0.05} height={0.05} fill='green' />
                        <rect x={2} y={2} width={0.05} height={0.05} fill='green' />

                        <rect x={-1} y={-1} width={0.05} height={0.05} fill='red' />
                        <rect x={-1} y={1} width={0.05} height={0.05} fill='red' />
                        <rect x={1} y={-1} width={0.05} height={0.05} fill='red' />
                        <rect x={1} y={1} width={0.05} height={0.05} fill='red' />

                        <rect x={0} y={0} width={0.05} height={0.05} fill='red' />
                    </g>
                </g>
            </svg>
        </div>
    )
}

function Node(props: { node: ObjNode; selectedNode: React.MutableRefObject<string>; transform: HeapTransform }) {
    const currentTransform = props.transform.nodes[props.node.reference]
    const finalTransform = currentTransform ? currentTransform : { dx: 0, dy: 0 }
    return (
        <g transform={`translate(${finalTransform.dx}, ${finalTransform.dy})`}>
            <rect
                x={0}
                y={0}
                width={0.1}
                height={0.1}
                fill='red'
                onMouseDown={() => (props.selectedNode.current = props.node.reference)}
                onMouseUp={() => (props.selectedNode.current = undefined)}
            />
        </g>
    )
}
