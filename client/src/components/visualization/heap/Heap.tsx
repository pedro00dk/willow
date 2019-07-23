import cn from 'classnames'
import * as React from 'react'
import * as ReactDom from 'react-dom'
import { State, useRedux } from '../../../reducers/Store'
import { ObjComp } from './ObjComp'
import { SvgView } from './SvgView'

const classes = {
    container: cn('d-flex', 'w-100 h-100'),
    line: cn('position-absolute', 'p-0 m-0')
}

export type Position = { position: { x: number; y: number }; setPosition: (p: { x: number; y: number }) => void }
export type Node = { name: string; parameters: { [option: string]: unknown } }
export type Link = { ref: HTMLElement; target: string; under: boolean }[]

export const Heap = React.memo(() => {
    const containerRef = React.useRef<HTMLDivElement>()
    const data = React.useRef<{
        scale: number
        positions: { [reference: string]: Position }
        links: { [reference: string]: Link }
        nodes: { [reference: string]: Node }
        typeNodes: { [type: string]: Node }
    }>()
    const { tracer } = useRedux(state => ({ tracer: state.tracer }))

    // if (!tracer.available) {
    //     //rect.current = new DOMRect()
    //     scale.current = { value: 1 }
    //     positions.current = {}
    //     nodes.current = {}
    //     typeNodes.current = {}
    //     links.current = {}
    // }

    return (
        <div ref={containerRef} className={classes.container}>
            {tracer.available && (
                <SvgView size={{ width: 750, height: 500 }} markers>
                    <g transform={`translate(${750 / 2},${500 / 2})`}>
                        {Object.values(tracer.heaps[tracer.index]).map(obj => {
                            return <ObjComp tracer={tracer} obj={obj} />
                        })}
                    </g>
                </SvgView>
            )}
        </div>
    )
})

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
