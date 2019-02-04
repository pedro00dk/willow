export type State = { text: string }
export type Action = { type: 'code/set', text: string }

const initialState: State = {
    text: ''
}

export const reducer = (state: State = initialState, action: Action) => {
    if (!action) return state
    switch (action.type) {
        case 'code/set': return { ...state, text: action.text }
    }
    return state
}
