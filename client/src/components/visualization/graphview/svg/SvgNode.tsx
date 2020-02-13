import { css } from 'emotion'
import React from 'react'
import { GraphData } from '../GraphData'
import { SvgEdges } from './SvgEdges'

const classes = {
    container: css({ cursor: 'move', userSelect: 'none' })
}

const styles = {
    animate: (animate: boolean) => (animate ? 'x 0.4s ease-out, y 0.4s ease-out' : 'none')
}

export const SvgNode = (props: { id: string; graphData: GraphData; children?: React.ReactNode }) => {
    const container$ = React.useRef<SVGForeignObjectElement>()
    const firstUpdate = React.useRef(true)
    const node = props.graphData.getNode(props.id)

    React.useLayoutEffect(() => {
        const updateNode = (callId?: number) => {
            const position = props.graphData.getNodePosition(node)
            const size = node.size
            container$.current.style.transition = styles.animate(!firstUpdate.current && props.graphData.getAnimate())
            container$.current.setAttribute('x', position.x.toString())
            container$.current.setAttribute('y', position.y.toString())
            container$.current.setAttribute('width', size.x.toString())
            container$.current.setAttribute('height', size.y.toString())
            firstUpdate.current = false
        }

        updateNode()
        props.graphData.subscribe(node.id, updateNode)
    })

    return (
        <>
            <foreignObject ref={container$} className={classes.container}>
                {props.children}
            </foreignObject>
            <SvgEdges id={props.id} graphData={props.graphData} />
        </>
    )
}
