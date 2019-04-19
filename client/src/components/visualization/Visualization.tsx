import * as React from 'react'
import { SplitPane } from '../SplitPane'
import { Heap } from './heap/Heap'
import { Stack } from './stack/Stack'

export function Visualization() {
    return (
        <SplitPane split='horizontal' base='15%' left={5} right={-5}>
            <Stack />
            <Heap />
        </SplitPane>
    )
}
