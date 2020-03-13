import * as schema from '../schema/schema'

/**
 * User entity.
 */
export type User = {
    id: string
    name: string
    email: string
    admin: boolean
}

/**
 * List of actions executed by a user.
 */
export type Actions = {
    id: User['id']
    actions: Action[]
}

/**
 * Any relevant action executed by a user.
 */
export type Action = {
    name: string
    date: Date
    payload: any
}

/**
 * List of programs saved by a user.
 */
export type Programs = {
    id: User['id']
    programs: Program[]
}

/**
 * Program data saved by a user.
 */
export type Program = {
    name: string
    language: string
    trace: Pick<schema.Trace, 'source' | 'input'>
}

/**
 * Example program that can be fetched by the user.
 */
export type Example = {
    name: string
    language: string
    trace: Pick<schema.Trace, 'source' | 'input'>
}
