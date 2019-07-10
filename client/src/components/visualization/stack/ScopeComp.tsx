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
        fill: isLeaf ? colors.blue.lighter : width >= 20 ? colors.blue.main : colors.blue.light
    })
}

const computeChildWidth = (parent: ScopeNode, child: ScopeNode, width: number) =>
    ((child.range[1] - child.range[0] + 1) / (parent.range[1] - parent.range[0] + 1)) * width

export const ScopeComp = React.memo((
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
    const dispatch = useDispatch()
    const { selected } = useRedux(state => ({
        selected: state.tracer.index >= props.scope.range[0] && state.tracer.index <= props.scope.range[1]
    }))
    const isRoot = props.scope.name == undefined && !!props.scope.children
    const isIntermediary = !isRoot && !!props.scope.children
    const isLeaf = !props.scope.children

    const clipPathId = `${props.baseX}-${props.baseY}`
    const cumulatedShift = { value: props.baseX }
    return (
        <>
            {!isRoot && (
                <g onClick={() => dispatch(tracerActions.setIndex(props.scope.range[0]))}>
                    {isIntermediary && (
                        <>
                            <clipPath id={clipPathId}>
                                <rect {...styles.rectSize(props.baseX, props.baseY, props.width, props.height, 2)} />
                            </clipPath>
                            {selected && (
                                <rect
                                    {...styles.rectSize(props.baseX, props.baseY, props.width, props.height, 0)}
                                    stroke={colors.gray.dark}
                                    fill='none'
                                >
                                    <title>{props.scope.name}</title>
                                </rect>
                            )}
                            <rect
                                {...styles.rectSize(props.baseX, props.baseY, props.width, props.height, 1)}
                                {...styles.color(props.width, props.current, isLeaf)}
                            >
                                <title>{props.scope.name}</title>
                            </rect>
                            {props.width >= 20 && (
                                <text
                                    {...styles.textSize(props.baseX, props.baseY, props.width, props.height, 2)}
                                    clipPath={`url(#${clipPathId})`}
                                >
                                    {props.scope.name}
                                </text>
                            )}
                        </>
                    )}
                    {isLeaf && (
                        <polygon
                            {...styles.triangleSize(props.baseX, props.baseY, props.width, props.height, 0)}
                            {...styles.color(props.width, props.current, isLeaf)}
                        ></polygon>
                    )}
                </g>
            )}
            {(isRoot || isIntermediary) &&
                props.width >= 10 &&
                props.scope.children.map(child => {
                    const childWidth = computeChildWidth(props.scope, child, props.width)
                    const childBaseX = cumulatedShift.value
                    const childBaseY = (props.current + 1) * props.height
                    cumulatedShift.value += childWidth
                    return (
                        <ScopeComp
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
})
