import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { Item, Menu, MenuProvider, Separator, Submenu } from 'react-contexify'
import { colors } from '../../../colors'
import { useDispatch, useRedux } from '../../../reducers/Store'
import { actions as visualizationActions } from '../../../reducers/visualization'
import { getDefault, getSupported, nodes } from './nodes/nodes'

import 'react-contexify/dist/ReactContexify.min.css'

const classes = {
    container: cn('d-block', 'w-100 h-100'),
    menuSelected: cn(css({ background: colors.primaryBlue.lighter }))
}

export function Heap() {
    const selectedObjRef = React.useRef<string>(undefined)
    const dispatch = useDispatch()
    const { tracer, visualization } = useRedux(state => ({
        tracer: state.tracer,
        visualization: state.visualization
    }))

    return (
        <div className={classes.container}>
            {tracer.available && (
                <>
                    {Object.values(visualization.heaps[tracer.index]).map(obj => {
                        const nodeType = visualization.nodeTypes[obj.reference]
                        // tslint:disable-next-line: variable-name
                        const Node = nodeType != undefined ? nodes[nodeType].Node : getDefault(obj).Node
                        return (
                            <MenuProvider id={obj.reference} style={{ display: 'inline-block' }}>
                                <Node
                                    key={obj.reference}
                                    obj={obj}
                                    select={reference => (selectedObjRef.current = reference)}
                                />
                            </MenuProvider>
                        )
                    })}
                    {Object.values(visualization.heaps[tracer.index]).map(obj => {
                        const nodeType = visualization.nodeTypes[obj.reference]
                        const resolvedNodeType = nodeType != undefined ? nodeType : getDefault(obj).name
                        const defaultNodeType = getDefault(obj).name
                        const supportedNodeTypes = getSupported(obj).map(supported => supported.name)
                        return (
                            <Menu id={obj.reference}>
                                <Submenu label={resolvedNodeType}>
                                    {supportedNodeTypes.map(type => (
                                        <Item
                                            key={type}
                                            className={type === resolvedNodeType ? classes.menuSelected : undefined}
                                            onClick={() =>
                                                dispatch(visualizationActions.setNodeType(obj.reference, type))
                                            }
                                        >
                                            {type}
                                        </Item>
                                    ))}
                                </Submenu>
                                <Separator />
                            </Menu>
                        )
                    })}
                </>
            )}
        </div>
    )
}
