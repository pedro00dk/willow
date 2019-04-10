import * as React from 'react'
import { Stack } from './Stack'

export function Visualization() {
    return (
        <div className='d-flex flex-column h-100 w-100'>
            <Stack />
            Graph
        </div>
    )
}
