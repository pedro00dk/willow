import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { Item, Menu, MenuProvider, Separator, Submenu } from 'react-contexify'
import { colors } from '../../../colors'
import { useDispatch, useRedux } from '../../../reducers/Store'
import { actions as visualizationActions, Obj } from '../../../reducers/visualization'
import * as ArrayNode from './ArrayNode'
import * as BarsNode from './BarsNode'
import * as BaseNodes from './BaseNode'
import * as PairsNode from './PairsNode'
import * as PropertyNode from './PropertyNode'

import 'react-contexify/dist/ReactContexify.min.css'

const classes = {
    container: cn('position-absolute', 'd-inline-flex'),
    nodeContainer: cn('d-inline-flex'),
    selected: cn(css({ background: colors.primaryBlue.lighter }))
}

const nodes = {
    array: ArrayNode,
    bars: BarsNode,
    pairs: PairsNode,
    property: PropertyNode
}

const orderedNodeTypes = ['array', 'bars', 'pairs', 'property'] as (keyof typeof nodes)[]

const getDefaultNode = (obj: Obj) => {
    // tslint:disable-next-line: variable-name
    const DefaultNode = Object.entries(nodes)
        .filter(([name, node]) => node.isDefault(obj))
        .map(([name, node]) => node.MemoNode)[0]
    return !!DefaultNode ? DefaultNode : BaseNodes.MemoSquareBaseNode
}

const getMainNode = (obj: Obj, objNode: string, typeNode: string) => {
    const castObjNode = objNode as keyof typeof nodes
    const castTypeNode = typeNode as keyof typeof nodes
    // tslint:disable-next-line: variable-name
    const Node = !!nodes[castObjNode]
        ? nodes[castObjNode].MemoNode
        : !!nodes[castTypeNode]
        ? nodes[castTypeNode].MemoNode
        : getDefaultNode(obj)

    return Node
}

// tslint:disable-next-line: variable-name
export const MemoNodeWrapper = React.memo(NodeWrapper)
export function NodeWrapper(props: {
    obj: Obj
    objects: React.MutableRefObject<{ [reference: string]: HTMLElement }>
    references: React.MutableRefObject<{ [reference: string]: HTMLElement[] }>
}) {
    const dragBase = React.useRef({ x: 0, y: 0 })
    const dispatch = useDispatch()
    const { objNode, objOptions, typeNode, typeOptions, translation = { x: 0, y: 0 }, scale } = useRedux(state => ({
        objNode: state.visualization.objNodes[props.obj.reference],
        objOptions: state.visualization.objOptions[props.obj.reference],
        typeNode: state.visualization.typeNodes[props.obj.languageType],
        typeOptions: state.visualization.typeOptions[props.obj.languageType],
        translation: state.visualization.objTranslations[props.obj.reference],
        scale: state.visualization.scale
    }))

    // tslint:disable-next-line: variable-name
    const Node = getMainNode(props.obj, objNode, typeNode)
    const options = objNode != undefined ? objOptions : typeNode != undefined ? typeOptions : undefined

    return (
        <div
            ref={ref => {
                if (!ref) return
                props.objects.current[props.obj.reference] = ref
            }}
            className={classes.container}
            style={{ left: translation.x, top: translation.y, transform: `scale(${scale})` }}
            draggable
            onDragStart={event => (dragBase.current = { x: event.clientX, y: event.clientY })}
            onDrag={event => {
                if (event.clientX === 0 && event.clientY === 0) return
                dispatch(
                    visualizationActions.setObjTranslation(props.obj.reference, {
                        x: translation.x + (event.clientX - dragBase.current.x),
                        y: translation.y + (event.clientY - dragBase.current.y)
                    })
                )
                dragBase.current = { x: event.clientX, y: event.clientY }
            }}
        >
            <div className={classes.nodeContainer}>
                <MenuProvider className={classes.nodeContainer} id={props.obj.reference}>
                    <Node obj={props.obj} options={options} objects={props.objects} references={props.references} />
                </MenuProvider>
            </div>
            <NodeMenu
                obj={props.obj}
                objNode={objNode}
                objOptions={objOptions}
                typeNode={typeNode}
                typeOptions={typeOptions}
            />
        </div>
    )
}

function NodeMenu(props: {
    obj: Obj
    objNode: string
    objOptions: { [option: string]: unknown }
    typeNode: string
    typeOptions: { [option: string]: unknown }
}) {
    const dispatch = useDispatch()
    const objNode = props.objNode as keyof typeof nodes
    const typeNode = props.typeNode as keyof typeof nodes
    // tslint:disable-next-line: variable-name
    const ObjNodeOptions = !!nodes[objNode] ? nodes[objNode].NodeOptions : undefined
    // tslint:disable-next-line: variable-name
    const TypeNodeOptions = !!nodes[typeNode] ? nodes[typeNode].NodeOptions : undefined

    return (
        <Menu id={props.obj.reference}>
            <Item disabled>{objNode != undefined ? objNode : typeNode != undefined ? typeNode : 'default'}</Item>
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
            <Submenu disabled={!ObjNodeOptions} label='object properties'>
                {!!ObjNodeOptions && (
                    <ObjNodeOptions
                        obj={props.obj}
                        options={props.objOptions}
                        onOptionsUpdate={options =>
                            dispatch(visualizationActions.setObjOptions(props.obj.reference, options))
                        }
                    />
                )}
            </Submenu>
            <Submenu disabled={!TypeNodeOptions} label='type properties'>
                {!!TypeNodeOptions && (
                    <TypeNodeOptions
                        obj={props.obj}
                        options={props.typeOptions}
                        onOptionsUpdate={options =>
                            dispatch(visualizationActions.setTypeOptions(props.obj.languageType, options))
                        }
                    />
                )}
            </Submenu>
        </Menu>
    )
}
