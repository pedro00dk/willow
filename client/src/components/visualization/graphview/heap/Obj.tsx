import { css } from 'emotion'
import React from 'react'
import { Item, Menu, MenuProvider, Separator, Submenu } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import { colors } from '../../../../colors'
import { actions, useDispatch } from '../../../../reducers/Store'
import * as tracer from '../../../../types/tracer'
import { Draggable } from '../../../utils/Draggable'
import { Edge, Graph, Node } from '../Graph'
import { getValueString } from '../TracerUtils'
import { Parameters } from './Parameters'
import * as ArrayModule from './shapes/Array'
import * as ColumnModule from './shapes/Column'
import * as FieldModule from './shapes/Field'
import * as MapModule from './shapes/Map'

const classes = {
    container: 'd-flex position-absolute',
    menuProvider: 'd-flex',
    wrapper: 'd-flex flex-column rounded',
    title: `px-1 ${css({ fontSize: '0.5rem' })}`,
    children: 'd-flex justify-content-center rounded p-1'
}
const styles = {
    layoutHighlight: (enabled: boolean) => (enabled ? colors.gray.light : colors.gray.lighter)
}
const shapes = {
    array: ArrayModule,
    column: ColumnModule,
    field: FieldModule,
    map: MapModule
}

export const Obj = (props: { id: string; obj: tracer.Obj; node: Node; graph: Graph; update: React.Dispatch<{}> }) => {
    const container$ = React.useRef<HTMLDivElement>()
    const wrapper$ = React.useRef<HTMLDivElement>()
    const members = Object.fromEntries(props.obj.members.map(member => [getValueString(member.key), member]))
    const previousMembers = React.useRef<typeof members>({})
    const references = React.useRef<{ key: string; target: string; ref$: HTMLSpanElement; edge: Partial<Edge> }[]>([])
    const dispatch = useDispatch()
    props.node.layout.applied = false

    const defaultShape = React.useMemo(
        () =>
            Object.entries(shapes).reduce(
                (acc, [name, mod]) => acc ?? (mod.defaults.has(props.obj.category) ? name : acc),
                undefined
            ),
        [props.obj.category]
    ) as keyof typeof shapes
    const shape = (props.node.getShape() ?? props.node.setShape(defaultShape)) as keyof typeof shapes
    const parameters = props.node.getParameters().get(shape, shapes[shape].defaultParameters)
    const Shape = shapes[shape].Shape

    React.useLayoutEffect(() => {
        const svg = container$.current.closest('svg')
        const rect = container$.current.getBoundingClientRect()
        const screenSize = { x: rect.width, y: rect.height }
        const [svgSize] = props.graph.view.transformVector('toSvg', svg, true, screenSize)
        props.node.size = svgSize
        references.current.forEach(({ key, target, ref$, edge }) => {
            const refRect = ref$.getBoundingClientRect()
            const screenDelta = { x: refRect.left - rect.left, y: refRect.top - rect.top }
            const screenSize = { x: refRect.width, y: refRect.height }
            const [svgDelta, svgSize] = props.graph.view.transformVector('toSvg', svg, true, screenDelta, screenSize)
            const delta = { x: svgDelta.x + svgSize.x / 2, y: svgDelta.y + svgSize.y / 2 }
            props.graph.pushEdge(props.id, key, {
                ...edge,
                target,
                from: { delta, source: 'self' },
                to: { delta: { x: 0, y: 0 }, source: 'target-near' }
            })
        })
        references.current = []
        props.graph.subscriptions.call(props.id)
    })

    React.useEffect(() => {
        if (!props.node.layout.enabled) return
        if (props.node.layout.applied) return
        console.log(props.node.id)
        const structure = props.node.findStructure()
        if (Object.keys(structure.members).length == 1) return
        const previousStructure = props.node.layout.structure
        if (previousStructure != undefined)
            Object.values(previousStructure.members).forEach(node => {
                console.log('cleaning', node.id)
                if (node === props.node) return
                node.layout.enabled = false
                node.layout.applied = false
                node.layout.position = undefined
                node.layout.structure = undefined
            })
        const position = props.node.layout.position ?? props.node.getPosition()
        const horizontal = props.node.layout.horizontal
        const layout = structure.applyLayout({ breadth: 1.5, depth: 1.5 }, horizontal, position, 'avl')
        Object.values(structure.members).forEach(node => {
            console.log('restoring', node.id)
            node.layout.enabled = true
            node.layout.applied = true
            node.layout.horizontal = horizontal
            node.layout.position = position
            node.layout.structure = structure
        })
        props.graph.animate = true
        Object.keys(layout).forEach(id => props.graph.subscriptions.call(id))
        dispatch(actions.user.action({ name: 'layout', payload: 'automatic' }))
    })

    React.useEffect(() => {
        ;(async () => {
            await undefined
            wrapper$.current.style.background = styles.layoutHighlight(props.node.layout.enabled)
        })()
    })

    React.useEffect(() => {
        previousMembers.current = members
    }, [props.obj])

    return (
        <Draggable
            props={{
                ref: container$,
                className: classes.container,
                onDoubleClick: event => {
                    const structure = props.node.findStructure()
                    const horizontal = !event.altKey
                    const position = props.node.getPosition()
                    Object.values(structure.members).forEach(node => {
                        node.layout.enabled = true
                        node.layout.applied = true
                        node.layout.horizontal = horizontal
                        node.layout.position = position
                        node.layout.structure = structure
                    })
                    const layout = structure.applyLayout({ breadth: 1.5, depth: 1.5 }, horizontal, position, 'ovr')
                    props.graph.animate = true
                    Object.keys(layout).forEach(id => props.graph.subscriptions.call(id))
                    props.update({})
                    dispatch(actions.user.action({ name: 'layout', payload: 'manual' }))
                }
            }}
            onDrag={(event, delta) => {
                const svg = container$.current.closest('svg')
                const [svgDelta] = props.graph.view.transformVector('toSvg', svg, false, delta)
                const depth = event.altKey ? Infinity : 0
                const mode = !event.ctrlKey ? 'ovr' : !event.shiftKey ? 'avl' : 'all'
                const movedNodes = props.node.move(svgDelta, depth, mode)
                const previousStructure = props.node.layout.structure
                if (previousStructure != undefined)
                    Object.values(previousStructure.members).forEach(node => {
                        node.layout.enabled = false
                        node.layout.applied = false
                        node.layout.position = undefined
                        node.layout.structure = undefined
                    })
                const currentStructure = props.node.findStructure()
                Object.values(currentStructure.members).forEach(node => {
                    node.layout.enabled = false
                    node.layout.applied = false
                    node.layout.position = undefined
                    node.layout.structure = undefined
                })
                props.graph.animate = false
                Object.values(movedNodes).forEach(node => props.graph.subscriptions.call(node.id))
            }}
            onDragEnd={() => props.update({})}
        >
            <MenuProvider id={props.id} className={classes.menuProvider}>
                <div className={classes.menuProvider}>
                    <div ref={wrapper$} className={classes.wrapper}>
                        <span className={classes.title}>{props.node.type}</span>
                        <div className={classes.children}>
                            <Shape
                                id={props.id}
                                obj={props.obj}
                                node={props.node}
                                parameters={parameters as any}
                                previousMembers={previousMembers.current}
                                onReference={reference => references.current.push(reference)}
                            />
                        </div>
                    </div>
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
        <Menu id={props.id}>
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
        </Menu>
    )
}
