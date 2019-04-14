import { Reducer } from 'redux'
import * as protocol from '../../protobuf/protocol'
import { AsyncAction } from '../Store'

export type ObjNode = {
    reference: string
    type: protocol.Obj.Type
    languageType: string
    userDefined: boolean
    members: { key: boolean | number | string | ObjNode; value: boolean | number | string | ObjNode }[]
}

export type Heap = { [reference: string]: ObjNode }

type State = {
    readonly heaps: Heap[]
}

type Action = { type: 'debug/heap/load'; payload: State }

const initialState: State = {
    heaps: []
}

export const reducer: Reducer<State, Action> = (state = initialState, action) => {
    switch (action.type) {
        case 'debug/heap/load':
            return { ...state, ...action.payload }
    }
    return state
}

function load(): AsyncAction {
    return async (dispatch, getState) => {
        const { debugResult } = getState()
        const heaps: State['heaps'] = []
        debugResult.steps.forEach((step, i) => {
            if (!step.snapshot) return heaps.push(!!heaps[i - 1] ? heaps[i - 1] : {})
            const heap: Heap = {}
            heaps.push(heap)
            Object.entries(step.snapshot.heap).forEach(([reference, obj]) => {
                heap[reference] = {
                    reference,
                    type: obj.type,
                    languageType: obj.languageType,
                    userDefined: obj.userDefined,
                    members: []
                }
            })
            Object.entries(heap).forEach(([reference, objNode]) => {
                const obj = step.snapshot.heap[reference]
                objNode.members = obj.members.map(member => {
                    const key =
                        member.key.reference != undefined
                            ? heap[member.key.reference]
                            : Object.values(member.key).filter(value => value != undefined)[0]
                    const value =
                        member.value.reference != undefined
                            ? heap[member.value.reference]
                            : Object.values(member.value).filter(value => value != undefined)[0]
                    return { key, value }
                })
            })
        })
        dispatch({ type: 'debug/heap/load', payload: { heaps } })
    }
}

export const actions = { load }
