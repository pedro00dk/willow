/**
 * The user type.
 */
export type User = {
    id: string
    name: string
    email: string
}

/**
 * Any relevant action executed by the user.
 */
export type Action = {
    name: string
    date: Date
    payload: any
}

/**
 * List of actions executed by the user.
 */
export type Actions = {
    id: User['id']
    actions: Action[]
}
