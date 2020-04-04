import React from 'react'
import 'react-contexify/dist/ReactContexify.min.css'
import { Item, Menu, MenuProvider, Separator, Submenu } from 'react-contexify'
import { actions, useDispatch } from '../../../../reducers/Store'
import * as tracer from '../../../../types/tracer'
import { Draggable } from '../../../utils/Draggable'
import { defaultLayoutParameters, Edge, Graph, Node } from '../Graph'
import { getMemberName, getValueString, isValueObject } from '../TracerUtils'
import { Parameters } from './Parameters'
import * as ArrayModule from './shapes/Array'
import * as ColumnModule from './shapes/Column'
import * as FieldModule from './shapes/Field'
import * as MapModule from './shapes/Map'

const classes = {
    container: 'd-flex position-absolute',
    menuProvider: 'd-flex'
}

const shapes = {
    array: ArrayModule,
    column: ColumnModule,
    field: FieldModule,
    map: MapModule
}

export const Obj = (props: { id: string; obj: tracer.Obj; node: Node; graph: Graph; update: React.Dispatch<{}> }) => {
    const container$ = React.useRef<HTMLDivElement>()
    const references = React.useRef<{ id: string; name: string; ref$: HTMLSpanElement; edge: Partial<Edge> }[]>()
    references.current = []
    const previousObj = React.useRef<tracer.Obj>()
    const previousMembers = React.useRef<{ [id: string]: tracer.Member }>({})
    const members = Object.fromEntries(props.obj.members.map(member => [getMemberName(member), member]))
    if (props.obj !== previousObj.current)
        previousMembers.current = Object.fromEntries(
            previousObj.current?.members.map(member => [getMemberName(member), member]) ?? []
        )
    previousObj.current = props.obj
    const dispatch = useDispatch()

    const defaultShape = React.useMemo(
        () =>
            Object.entries(shapes).reduce(
                (acc, [name, mod]) => acc ?? (mod.defaults.has(props.obj.category) ? name : acc),
                undefined
            ) as keyof typeof shapes,
        [props.obj.category]
    )

    const shape = (props.node.getShape() ?? props.node.setShape(defaultShape)) as keyof typeof shapes
    const parameters = props.node.getParameters().get(shape, shapes[shape].defaultParameters)
    const Shape = shapes[shape].Shape

    React.useLayoutEffect(() => {
        const svg = container$.current.closest('svg')
        const rect = container$.current.getBoundingClientRect()
        const screenSize = { x: rect.width, y: rect.height }
        const [svgSize] = props.graph.view.transformVector('toSvg', svg, true, screenSize)
        props.node.size.width = svgSize.x
        props.node.size.height = svgSize.y
    })

    React.useLayoutEffect(() => {
        const svg = container$.current.closest('svg')
        const rect = container$.current.getBoundingClientRect()
        references.current.forEach(({ id: target, name, ref$, edge }) => {
            const refRect = ref$.getBoundingClientRect()
            const screenDelta = { x: refRect.left - rect.left, y: refRect.top - rect.top }
            const screenSize = { x: refRect.width, y: refRect.height }
            const [svgDelta, svgSize] = props.graph.view.transformVector('toSvg', svg, true, screenDelta, screenSize)
            const delta = { x: svgDelta.x + svgSize.x / 2, y: svgDelta.y + svgSize.y / 2 }
            props.graph.pushEdge(props.node.id, name, {
                ...edge,
                self: true,
                target,
                from: { delta, source: 'self' },
                to: { delta: { x: 0, y: 0 }, source: 'target-near' }
            })
        })
    })

    React.useLayoutEffect(() => props.graph.subscriptions.call(props.id))

    React.useEffect(() => {
        const layoutParameters = props.node.parameters.get('layout', defaultLayoutParameters)
        if (!layoutParameters.enabled) return (props.node.layout.position = undefined)
        const target = !layoutParameters.target
            ? props.id
            : members[layoutParameters.target] && isValueObject(members[layoutParameters.target].value)
            ? getValueString(members[layoutParameters.target].value)
            : undefined
        if (!target || target === props.id) return
        const structure = props.graph.getNode(target).findStructure()
        if (!props.node.layout.position) props.node.layout.position = structure.base.getPosition()
        structure.base.setPosition(props.node.layout.position, 'avl')
        const layout = structure.applyLayout(
            {
                breadth: layoutParameters['breadth increment'],
                depth: layoutParameters['depth increment']
            },
            layoutParameters.direction === 'horizontal',
            props.node.layout.position,
            'avl'
        )
        props.graph.subscriptions.subscribe(structure.base.id, () => {
            props.node.layout.position = props.graph.getNode(structure.base.id).getPosition()
        })
        props.graph.animate = true
        Object.keys(layout).forEach(id => props.graph.subscriptions.call(id))
        dispatch(actions.user.action({ name: 'layout', payload: 'automatic' }))
    })

    return (
        <Draggable
            props={{
                ref: container$,
                className: classes.container,
                onDoubleClick: event => {
                    const horizontal = !event.altKey
                    const mode = !event.ctrlKey ? 'avl' : !event.shiftKey ? 'ovr' : 'all'
                    const layoutParameters = props.node.parameters.get('layout', defaultLayoutParameters)
                    const layout = props.node.findStructure().applyLayout(
                        {
                            breadth: layoutParameters['breadth increment'],
                            depth: layoutParameters['depth increment']
                        },
                        horizontal,
                        props.node.getPosition(),
                        mode
                    )
                    props.graph.animate = true
                    Object.keys(layout).forEach(id => props.graph.subscriptions.call(id))
                    dispatch(actions.user.action({ name: 'layout', payload: 'manual' }))
                }
            }}
            onDrag={(event, delta) => {
                const svg = container$.current.closest('svg')
                const [svgDelta] = props.graph.view.transformVector('toSvg', svg, false, delta)
                const depth = event.altKey ? Infinity : 0
                const mode = !event.ctrlKey ? 'avl' : !event.shiftKey ? 'ovr' : 'all'
                const movedNodes = props.node.move(svgDelta, depth, mode)
                props.graph.animate = false
                Object.values(movedNodes).forEach(node => props.graph.subscriptions.call(node.id))
            }}
        >
            <MenuProvider id={props.node.id} className={classes.menuProvider}>
                <div className={classes.menuProvider}>
                    <Shape
                        id={props.node.id}
                        obj={props.obj}
                        parameters={parameters as any}
                        previousMembers={previousMembers.current}
                        onReference={reference => references.current.push(reference)}
                    />
                </div>
            </MenuProvider>
            <ObjMenu {...props} />
        </Draggable>
    )
}

const ObjMenu = (props: { id: string; obj: tracer.Obj; node: Node; graph: Graph; update: React.Dispatch<{}> }) => {
    const dispatch = useDispatch()

    const defaultShape = React.useMemo(
        () =>
            Object.entries(shapes).reduce(
                (acc, [name, mod]) => acc ?? (mod.defaults.has(props.obj.category) ? name : acc),
                undefined
            ) as keyof typeof shapes,
        [props.obj.category]
    )

    const supportedShapes = React.useMemo(
        () =>
            Object.entries(shapes).reduce(
                (acc, [name, mod]) => (mod.supported.has(props.obj.category) && acc.push(name), acc),
                []
            ) as (keyof typeof shapes)[],
        [props.obj.category]
    )

    const shape = (props.node.getShape() ?? props.node.setShape(defaultShape)) as keyof typeof shapes
    const parameters = props.node.getParameters().get(shape, shapes[shape].defaultParameters)

    return (
        <Menu id={props.node.id}>
            <Item
                onClick={() => {
                    props.node.mode = props.node.mode === 'local' ? 'type' : 'local'
                    props.update({})
                    dispatch(actions.user.action({ name: 'change node mode', payload: props.node.mode }))
                }}
            >
                <span title='Click to change mode'>{`using ${props.node.mode} parameters`}</span>
            </Item>
            <Separator />
            <Submenu label='Shapes'>
                <Item
                    onClick={() => {
                        props.node.setShape(defaultShape)
                        props.update({})
                        dispatch(actions.user.action({ name: 'change shape', payload: defaultShape }))
                    }}
                >
                    {'Click to reset shape'}
                </Item>
                {supportedShapes.map((shape, i) => (
                    <Item
                        key={i}
                        onClick={() => {
                            props.node.setShape(shape)
                            props.update({})
                            dispatch(actions.user.action({ name: 'change shape', payload: shape }))
                        }}
                    >
                        {`${shape[0].toUpperCase()}${shape.slice(1)}`}
                    </Item>
                ))}
            </Submenu>
            <Separator />
            <Submenu label='Shape parameters'>
                <Parameters
                    resetMessage='Click to reset parameters'
                    parameters={parameters}
                    defaults={shapes[shape].defaultParameters}
                    obj={props.obj}
                    onChange={parameters => {
                        props.node.getParameters().set(props.node.getShape(), parameters)
                        props.update({})
                    }}
                />
            </Submenu>
            <Separator />
            <Submenu label='Automatic layout'>
                <Parameters
                    resetMessage='Click to reset layout parameters'
                    parameters={props.node.parameters.get('layout', defaultLayoutParameters)}
                    defaults={defaultLayoutParameters}
                    obj={props.obj}
                    onChange={parameters => {
                        props.node.parameters.set('layout', parameters)
                        props.update({})
                    }}
                />
            </Submenu>
        </Menu>
    )
}
