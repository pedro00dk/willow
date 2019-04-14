import * as React from 'react'
import { SplitPane } from '../SplitPane'
import { Heap } from './Heap'
import { Stack } from './Stack'

export function Visualization() {
    return (
        <SplitPane className='d-flex position-relative' resizable split='horizontal' base='35%' left={50} right={-50}>
            <Stack />
            <Heap />
        </SplitPane>
    )
}
