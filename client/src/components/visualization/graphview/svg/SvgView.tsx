import React from 'react'
import { colors } from '../../../../colors'
import { Graph, ilerp } from '../Graph'

const classes = {
    container: 'd-flex position-absolute overflow-auto'
}

export const SvgView = (props: { graph: Graph; children?: React.ReactNode }) => {
    const container$ = React.useRef<SVGSVGElement>()
    const click = React.useRef(false)
    const viewSize = props.graph.view.size
    const box = React.useRef({ x: 0, y: 0, width: viewSize.width / 2, height: viewSize.height / 2 })
    const ranges = {
        x: { min: 0, max: viewSize.width },
        y: { min: 0, max: viewSize.height },
        width: { min: viewSize.width / 4, max: viewSize.width },
        height: { min: viewSize.height / 4, max: viewSize.height }
    }

    React.useLayoutEffect(() => {
        const onResize = () => {
            const element$ = container$.current
            const parent$ = element$.parentElement
            if (element$.clientWidth === parent$.clientWidth && element$.clientHeight === parent$.clientHeight) return
            element$.style.width = `${parent$.clientWidth}px`
            element$.style.height = `${parent$.clientHeight}px`
            props.graph.view.box = box.current
        }
        onResize()
        globalThis.addEventListener('paneResize', onResize)
        return () => globalThis.removeEventListener('paneResize', onResize)
    }, [container$.current])

    const translateBox = (delta: { x: number; y: number }) => {
        box.current.x = Math.min(Math.max(box.current.x - delta.x, ranges.x.min), ranges.x.max - box.current.width)
        box.current.y = Math.min(Math.max(box.current.y - delta.y, ranges.y.min), ranges.y.max - box.current.height)
        container$.current.setAttribute('viewBox', Object.values(box.current).join(' '))
        props.graph.view.box = box.current
    }

    const scaleBox = (point: { x: number; y: number }, direction: 'in' | 'out') => {
        const factor = (box.current.width / viewSize.width) * (direction === 'in' ? 50 : -50)
        const ratio = {
            x: ilerp(point.x, box.current.x, box.current.x + box.current.width),
            y: ilerp(point.y, box.current.y, box.current.y + box.current.height)
        }
        const size = {
            width: Math.min(Math.max(box.current.width - factor, ranges.width.min), ranges.width.max),
            height: Math.min(Math.max(box.current.height - factor, ranges.height.min), ranges.height.max)
        }
        if (size.width === box.current.width && size.height === box.current.height) return
        box.current.x = Math.min(Math.max(box.current.x + factor * ratio.x, ranges.x.min), ranges.x.max - size.width)
        box.current.y = Math.min(Math.max(box.current.y + factor * ratio.y, ranges.y.min), ranges.y.max - size.height)
        box.current.width = size.width
        box.current.height = size.height
        container$.current.setAttribute('viewBox', Object.values(box.current).join(' '))
        props.graph.view.box = box.current
    }

    return (
        <svg
            ref={container$}
            className={classes.container}
            viewBox={Object.values(box.current).join(' ')}
            preserveAspectRatio='xMidYMid meet'
            onMouseDown={() => (click.current = true)}
            onMouseUp={() => (click.current = false)}
            onMouseLeave={() => (click.current = false)}
            onMouseMove={event => {
                if (!click.current) return
                const screenDelta = { x: event.movementX, y: event.movementY }
                const [svgDelta] = props.graph.view.transformVector('toSvg', container$.current, true, screenDelta)
                translateBox(svgDelta)
            }}
            onWheel={event => {
                const screenPoint = { x: event.clientX, y: event.clientY }
                const [svgPoint] = props.graph.view.transformPoint('toSvg', container$.current, true, screenPoint)
                scaleBox(svgPoint, event.deltaY < 0 ? 'in' : 'out')
            }}
        >
            <title>{'Drag and scroll to pawn and zoom'}</title>
            <g>
                <rect fill={colors.gray.lighter} x={-10000} y={-10000} width={20000} height={20000} />
                <rect fill='white' {...viewSize} />
                <rect
                    fill='none'
                    stroke={colors.gray.lighter}
                    x={viewSize.width / 4}
                    y={viewSize.height / 4}
                    width={viewSize.width / 2}
                    height={viewSize.height / 2}
                />
            </g>

            {props.children}
        </svg>
    )
}
