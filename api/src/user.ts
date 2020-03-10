/**
 * The user type.
 */
export type User = {
    id: string
    name: string
    email: string
}

/**
 * List of actions executed by the user.
 */
export type Actions = {
    id: User['id']
    actions: {
        date: Date
        name: string
        payload: string
    }[]
}
