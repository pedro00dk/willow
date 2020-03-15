import * as tracer from './tracer'

// User related models.

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
    request: Pick<tracer.Request, 'source' | 'input'>
}

// Example related models.

/**
 * Example program that can be fetched by the user.
 */
export type Example = {
    name: string
    language: string
    request: Pick<tracer.Request, 'source' | 'input'>
}

// Tracer related models

/**
 * Requests from a client, it contains the source language but not steps, since it is managed by the api.
 */
export type ClientRequest = {
    language: string
    source: tracer.Request['source']
    input: tracer.Request['input']
}
