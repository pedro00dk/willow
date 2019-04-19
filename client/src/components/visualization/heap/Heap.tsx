import cn from 'classnames'
import * as React from 'react'
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu'
import { useRedux } from '../../../reducers/Store'
import { Array } from './nodes/Array'
import { Bars } from './nodes/Bars'

const classes = {
    container: cn('d-block', 'w-100 h-100')
}

export function Heap() {
    const { tracer, visualization } = useRedux(state => ({
        tracer: state.tracer,
        visualization: state.visualization
    }))

    return (
        <ContextMenuTrigger id='some_unique_identifier'>
            <div className={classes.container}>
                {tracer.available && Object.values(visualization.heaps[tracer.index]).map(node => <Array obj={node} />)}
            </div>
            <ContextMenu id='some_unique_identifier'>
                <MenuItem data={{ foo: 'bar' }}>ContextMenu Item 1</MenuItem>
                <MenuItem data={{ foo: 'bar' }}>ContextMenu Item 2</MenuItem>
                <MenuItem divider />
                <MenuItem data={{ foo: 'bar' }}>ContextMenu Item 3</MenuItem>
            </ContextMenu>
        </ContextMenuTrigger>
    )
}
