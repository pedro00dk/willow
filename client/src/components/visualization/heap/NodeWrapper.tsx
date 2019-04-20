import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { Item, Menu, MenuProvider, Separator, Submenu } from 'react-contexify'
import { colors } from '../../../colors'
import { useDispatch } from '../../../reducers/Store'
import { actions as visualizationActions, Obj } from '../../../reducers/visualization'
import * as ArrayNode from './ArrayNode'
import * as BarsNode from './BarsNode'
import * as BaseNodes from './BaseNode'

const classes = {
    container: cn('d-inline-flex'),
    selected: cn(css({ background: colors.primaryBlue.lighter }))
}

const nodes = {
    array: { ...ArrayNode, Node: ArrayNode.ArrayNode },
    bars: { ...BarsNode, Node: BarsNode.BarsNode }
}

const orderedNodeTypes = ['array', 'bars'] as (keyof typeof nodes)[]

const getDefault = (obj: Obj) =>
    Object.entries(nodes)
        .filter(([name, node]) => node.isDefault(obj))
        .map(([name, node]) => name)[0]

export function NodeWrapper(props: { obj: Obj; objNode: string; typeNode: string }) {
    const currentNode = (props.objNode != undefined
        ? props.objNode
        : props.typeNode != undefined
        ? props.typeNode
        : getDefault(props.obj)) as keyof typeof nodes

    // tslint:disable-next-line: variable-name
    const Node = currentNode != undefined ? nodes[currentNode].Node : BaseNodes.SquareBaseNode

    return (
        <>
            <MenuProvider id={props.obj.reference} className={classes.container}>
                <Node obj={props.obj} />
            </MenuProvider>
            <NodeMenu obj={props.obj} objNode={props.objNode} typeNode={props.typeNode} currentNode={currentNode} />
        </>
    )
}

function NodeMenu(props: { obj: Obj; objNode: string; typeNode: string; currentNode: string }) {
    const dispatch = useDispatch()

    return (
        <Menu id={props.obj.reference}>
            <Item disabled>{props.currentNode != undefined ? props.currentNode : 'not defined'}</Item>
            <Separator />
            <Submenu label='object node'>
                {orderedNodeTypes.map(node => (
                    <Item
                        key={node}
                        className={node === props.objNode ? classes.selected : undefined}
                        onClick={() => dispatch(visualizationActions.setObjNode(props.obj.reference, node))}
                    >
                        {node}
                    </Item>
                ))}
                <Item
                    key='reset'
                    onClick={() => dispatch(visualizationActions.setObjNode(props.obj.reference, undefined))}
                >
                    reset
                </Item>
            </Submenu>
            <Submenu label='type node'>
                {orderedNodeTypes.map(node => (
                    <Item
                        key={node}
                        className={node === props.typeNode ? classes.selected : undefined}
                        onClick={() => dispatch(visualizationActions.setTypeNode(props.obj.languageType, node))}
                    >
                        {node}
                    </Item>
                ))}
                <Item
                    key='reset'
                    onClick={() => dispatch(visualizationActions.setTypeNode(props.obj.languageType, undefined))}
                >
                    reset
                </Item>
            </Submenu>
            <Separator />
        </Menu>
    )
}
