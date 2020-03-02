/**
 * User reducer updates the user information and collect user actions.
 */
type State = {
    fetching: boolean
    logged: boolean
    email: string
    actions: ({ time: Date } & (
        | { action: 'login' }
        | { action: 'trace'; steps: string; code: string; compilationFail: boolean; executionFail: boolean }
        | { action: 'loadWillowExample'; exampleId: string }
        | { action: 'loadOwnExample'; exampleId: string }
        | { action: 'saveOwnExample'; exampleId: string }
    ))[]
    error?: string
}

type Action =
    | { type: 'user/signIn'; payload: string }
    | { type: 'user/signOut' }
    | { type: 'user/action'; payload: State['actions'][0] }

const initialState: State = {
    fetching: false,
    logged: false,
    email: undefined,
    actions: []
}

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case 'user/signIn':
        case 'user/signOut':
        case 'user/action':

        default:
            return state
    }
}

export const actions = {}
