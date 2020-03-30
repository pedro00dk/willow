import { css } from 'emotion'
import React from 'react'
import { Graph } from '../Graph'
import { SvgEdges } from './SvgEdges'

const classes = {
    container: css({ cursor: 'move', userSelect: 'none' })
}

const styles = {
    animate: (animate: boolean) => (animate ? 'x 0.4s ease-out, y 0.4s ease-out' : 'none')
}

export const SvgNode = (props: { id: string; graphData: Graph; children?: React.ReactNode }) => {
    const container$ = React.useRef<SVGForeignObjectElement>()
    const node = props.graphData.getNode(props.id)

    React.useLayoutEffect(() => {
        const updateNode = () => {
            const position = props.graphData.getNodePosition(node)
            const newNode = container$.current.getAttribute('x') == undefined
            container$.current.style.transition = styles.animate(!newNode && props.graphData.getAnimate())
            container$.current.setAttribute('x', position.x.toString())
            container$.current.setAttribute('y', position.y.toString())
            container$.current.setAttribute('width', node.size.x.toString())
            container$.current.setAttribute('height', node.size.y.toString())
        }
        updateNode()
        props.graphData.subscribe(node.id, updateNode)
    })

    return (
        <>
            <foreignObject ref={container$} className={classes.container}>
                {props.children}
            </foreignObject>
            <SvgEdges id={node.id} graphData={props.graphData} />
        </>
    )
}
