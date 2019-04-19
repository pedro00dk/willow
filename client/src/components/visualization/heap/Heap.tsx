import cn from 'classnames'
import * as React from 'react'
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu'
import { useRedux } from '../../../reducers/Store'
import { getDefault, getSupported, nodes } from './nodes/nodes'

const classes = {
    container: cn('d-block', 'w-100 h-100')
}

export function Heap() {
    const selectedObjRef = React.useRef<string>(undefined)
    const { tracer, visualization } = useRedux(state => ({
        tracer: state.tracer,
        visualization: state.visualization
    }))

    return (
        <ContextMenuTrigger id='heap context menu'>
            <div className={classes.container}>
                {tracer.available &&
                    Object.values(visualization.heaps[tracer.index]).map(obj => {
                        const nodeType = visualization.nodeTypes[obj.reference]
                        // tslint:disable-next-line: variable-name
                        const Node = nodeType != undefined ? nodes[nodeType].Node : getDefault(obj).Node
                        return <Node obj={obj} select={reference => (selectedObjRef.current = reference)} />
                    })}
            </div>
            <ContextMenu id='heap context menu'>
                <MenuItem data={{ foo: 'bar' }}>ContextMenu Item 1</MenuItem>
                <MenuItem data={{ foo: 'bar' }}>ContextMenu Item 2</MenuItem>
                <MenuItem divider />
                <MenuItem data={{ foo: 'bar' }}>ContextMenu Item 3</MenuItem>
            </ContextMenu>
        </ContextMenuTrigger>
    )
}
