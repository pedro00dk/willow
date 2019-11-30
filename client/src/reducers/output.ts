import * as schema from '../schema/schema'

type State = string[]

type Action = { type: 'output/set'; payload: string[] }

const initialState: State = []

export const reducer = (state: State = initialState, action: Action): State =>
    action.type === 'output/set' ? action.payload : state

const compute = (steps: schema.Step[]): Action => {
    let previous = ''
    const payload = steps.map(
        ({ prints, threw }) =>
            (previous = `${previous}${threw?.cause ?? threw?.exception.traceback ?? ''}${prints ?? ''}`)
    )
    return { type: 'output/set', payload }
}

const clear = () => ({ type: 'output/set', payload: [] as string[] })

export const actions = { compute, clear }
