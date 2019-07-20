import * as React from 'react'
import { colors } from '../../../colors'
import { useDispatch, useRedux } from '../../../reducers/Store'
import { actions as tracerActions } from '../../../reducers/tracer'
import { ScopeNode } from '../../../reducers/tracer'

const styles = {
    rectSize: (x: number, y: number, width: number, height: number, padding: number) => ({
        x: x + padding,
        y: y + padding,
        width: width - padding * 2,
        height: height - padding * 2
    }),
    textSize: (x: number, y: number, width: number, height: number, padding: number) => ({
        ...styles.rectSize(x, y, width, height, padding),
        y: y + padding + height * 0.7,
        fontSize: height * 0.8
    }),
    triangleSize: (x: number, y: number, width: number, height: number, padding: number) => ({
        points: `${x + padding},${y + padding}
            ${x + width / 2},${y + padding + height / 2}
            ${x + width - padding},${y + padding}`
    }),

    color: (width: number, depth: number, isLeaf: boolean) => ({
        fill: isLeaf ? colors.blue.lighter : width >= 40 ? colors.blue.main : colors.blue.light
    })
}

const computeChildWidth = (parent: ScopeNode, child: ScopeNode, width: number) =>
    ((child.range[1] - child.range[0] + 1) / (parent.range[1] - parent.range[0] + 1)) * width

export const ScopeComp = (
    props: {
        scope: ScopeNode
        depth: number
        current: number
        baseX: number
        baseY: number
        width: number
        height: number
    } //
) => {
    const selectedRectRef = React.useRef<SVGRectElement>()
    const dispatch = useDispatch()
    useRedux(async state => {
        if (!selectedRectRef.current) return
        const selected = state.tracer.index >= props.scope.range[0] && state.tracer.index <= props.scope.range[1]
        const stroke = selectedRectRef.current.getAttribute('stroke')
        if (selected && stroke === 'none') selectedRectRef.current.setAttribute('stroke', colors.gray.dark)
        else if (!selected && stroke !== 'none') selectedRectRef.current.setAttribute('stroke', 'none')
    })

    const isRoot = props.scope.name == undefined && !!props.scope.children
    const isIntermediary = !isRoot && !!props.scope.children
    const isLeaf = !props.scope.children
    const clipPathId = `${props.baseX}-${props.baseY}`
    const cumulatedShift = { value: props.baseX }
    const rectSizeP0 = styles.rectSize(props.baseX, props.baseY, props.width, props.height, 0)
    const rectSizeP1 = styles.rectSize(props.baseX, props.baseY, props.width, props.height, 1)
    const rectSizeP2 = styles.rectSize(props.baseX, props.baseY, props.width, props.height, 2)
    const textSize = styles.textSize(props.baseX, props.baseY, props.width, props.height, 2)
    const trianglePoints = styles.triangleSize(props.baseX, props.baseY, props.width, props.height, 0)

    return (
        <>
            {!isRoot && (
                <g onClick={() => dispatch(tracerActions.setIndex(props.scope.range[0]))}>
                    {isIntermediary && (
                        <>
                            <clipPath id={clipPathId}>
                                <rect {...rectSizeP2} />
                            </clipPath>
                            <rect ref={selectedRectRef} {...rectSizeP0} stroke='none' fill='none' />
                            <rect {...rectSizeP1} {...styles.color(props.width, props.current, isLeaf)}>
                                <title>{props.scope.name}</title>
                            </rect>
                            {props.width >= 40 && (
                                <text {...textSize} fontFamily='monospace' clipPath={clipPathId}>
                                    {props.scope.name}
                                </text>
                            )}
                        </>
                    )}
                    {isLeaf && <polygon {...trianglePoints} {...styles.color(props.width, props.current, isLeaf)} />}
                </g>
            )}
            {(isRoot || isIntermediary) &&
                props.width >= 10 &&
                props.scope.children.map((child, i) => {
                    const childWidth = computeChildWidth(props.scope, child, props.width)
                    const childBaseX = cumulatedShift.value
                    const childBaseY = (props.current + 1) * props.height
                    cumulatedShift.value += childWidth
                    return (
                        <ScopeComp
                            key={i}
                            scope={child}
                            depth={props.depth}
                            current={props.current + 1}
                            baseX={childBaseX}
                            baseY={childBaseY}
                            width={childWidth}
                            height={props.height}
                        />
                    )
                })}
        </>
    )
}
