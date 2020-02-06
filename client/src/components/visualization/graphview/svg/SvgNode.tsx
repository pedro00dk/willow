import { css } from 'emotion'
import React from 'react'
import { GraphData } from '../GraphData'

const classes = {
    container: css({ cursor: 'move' })
}

const styles = {
    animate: (animate: boolean) => (animate ? 'x 0.4s ease-out, y 0.4s ease-out' : 'none')
}

export const SvgNode = (props: { id: string; graphData: GraphData; children?: React.ReactNode }) => {
    const container$ = React.useRef<SVGForeignObjectElement>()

    React.useLayoutEffect(() => {
        const updateContainer = (callId?: number) => {
            const position = props.graphData.getNodePosition(props.id, props.graphData.getIndex())
            const size = props.graphData.getNodeSize(props.id, props.graphData.getIndex())
            container$.current.style.transition = styles.animate(props.graphData.getAnimate())
            container$.current.setAttribute('x', position.x.toString())
            container$.current.setAttribute('y', position.y.toString())
            container$.current.setAttribute('width', size.x.toString())
            container$.current.setAttribute('height', size.y.toString())
        }

        updateContainer()
        props.graphData.subscribe(props.id, updateContainer)
    }, [container$.current, props.id, props.graphData])

    return (
        <foreignObject ref={container$} className={classes.container}>
            {props.children}
        </foreignObject>
    )
}
