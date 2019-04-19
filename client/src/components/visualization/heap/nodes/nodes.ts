import { Obj } from '../../../../reducers/visualization'
import * as Array from './Array'
import * as Bars from './Bars'
import * as Base from './Base'

// nodes must be ordered by complexity
const nodesList = [{ ...Bars }, { ...Array }, { ...Base }]

export const nodes = nodesList.reduce<{ [name: string]: typeof nodesList[0] }>(
    (acc, node) => ({ ...acc, [node.name]: node }),
    {}
)

export const getDefault = (obj: Obj) =>
    Object.values(nodes)
        .filter(nodeData => nodeData.isDefault(obj))
        .pop()

export const getSupported = (obj: Obj) => Object.values(nodes).filter(nodeData => nodeData.isSupported(obj))
