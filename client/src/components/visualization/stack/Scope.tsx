import * as React from 'react'
import { colors } from '../../../colors'
import { useDispatch, useRedux } from '../../../reducers/Store'
import { actions as tracerActions } from '../../../reducers/tracer'
import { ScopeNode } from '../../../reducers/tracer'

const styles = {
    rectLayout: (x: number, y: number, width: number, height: number, padding: number) => ({
        x: x + padding,
        y: y + padding,
        width: width - padding * 2,
        height: height - padding * 2
    }),
    textLayout: (x: number, y: number, width: number, height: number, padding: number) => ({
        ...styles.rectLayout(x, y, width, height, padding),
        y: y + padding + height * 0.7,
        fontSize: height * 0.8
    }),
    triangleLayout: (x: number, y: number, width: number, height: number, padding: number) => ({
        points: `${x + padding},${y + padding}
            ${x + width / 2},${y + padding + height / 2}
            ${x + width - padding},${y + padding}`
    }),

    color: (width: number, isLeaf: boolean) =>
        isLeaf ? colors.blue.lighter : width >= 40 ? colors.blue.main : colors.blue.light
}

const computeChildWidth = (parent: ScopeNode, child: ScopeNode, width: number) =>
    ((child.range[1] - child.range[0] + 1) / (parent.range[1] - parent.range[0] + 1)) * width

export const Scope = (props: {
    scope: ScopeNode
    depth: number
    x: number
    y: number
    width: number
    height: number
}) => {
    const rectRef = React.useRef<SVGRectElement>()
    const dispatch = useDispatch()
    useRedux(async state => {
        if (!rectRef.current) return
        const selected = state.tracer.index >= props.scope.range[0] && state.tracer.index <= props.scope.range[1]
        const stroke = rectRef.current.getAttribute('stroke')
        if (selected && stroke === 'white') rectRef.current.setAttribute('stroke', colors.gray.dark)
        else if (!selected && stroke !== 'white') rectRef.current.setAttribute('stroke', 'white')
    })

    const isRoot = props.scope.name == undefined && !!props.scope.children
    const isIntermediary = !isRoot && !!props.scope.children
    const isLeaf = !props.scope.children

    const clipPathId = props.scope.range.toString()
    const shift = { value: props.x }
    const rectLayout = styles.rectLayout(props.x, props.y, props.width, props.height, 0.5)
    const textLayout = styles.textLayout(props.x, props.y, props.width, props.height, 2)
    const trianglePoints = styles.triangleLayout(props.x, props.y, props.width, props.height, 0)

    return (
        <>
            {!isRoot && (
                <g onClick={() => dispatch(tracerActions.setIndex(props.scope.range[0]))}>
                    {isIntermediary && (
                        <>
                            <rect ref={rectRef} {...rectLayout} fill={styles.color(props.width, isLeaf)} stroke='white'>
                                <title>{props.scope.name}</title>
                            </rect>
                            <text {...textLayout} fontFamily='monospace'>
                                {props.width >= 40 && props.scope.name}
                            </text>
                        </>
                    )}
                    {isLeaf && <polygon {...trianglePoints} fill={styles.color(props.width, isLeaf)} />}
                </g>
            )}
            {(isRoot || isIntermediary) &&
                props.width >= 10 &&
                props.scope.children.map((child, i) => {
                    const childWidth = computeChildWidth(props.scope, child, props.width)
                    const childX = shift.value
                    const childY = (props.depth + 1) * props.height
                    shift.value += childWidth
                    return (
                        <Scope
                            key={i}
                            scope={child}
                            depth={props.depth + 1}
                            x={childX}
                            y={childY}
                            width={childWidth}
                            height={props.height}
                        />
                    )
                })}
        </>
    )
}
