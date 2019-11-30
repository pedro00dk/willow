import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import { useSelection } from '../../../reducers/Store'
import { ScopeTrace } from './ScopeTrace'

export type ScopeData = { name: string; children: ScopeData[]; start: number; size: number; threw: boolean }

const classes = {
    container: cn('d-flex align-items-start flex-nowrap overflow-auto w-100 h-100', css({ userSelect: 'none' }))
}

export const StackTrace = React.memo(() => {
    const ref = React.useRef<HTMLDivElement>()
    const [width, setWidth] = React.useState(0)
    const { steps } = useSelection(state => ({ steps: state.tracer.steps }))

    const stackData = React.useMemo(() => {
        if (!steps) return
        const rootData: ScopeData = { name: undefined, children: [], start: 0, size: steps.length, threw: false }
        const scopePath: ScopeData[] = []
        scopePath[-1] = rootData
        steps.forEach(({ snapshot, threw }, i) => {
            if (threw) {
                scopePath.splice(0)
                const name = threw.cause ?? threw.exception.type
                const threwData: ScopeData = { name, children: [], start: i, size: 1, threw: true }
                const parentScopeData = scopePath[scopePath.length - 1]
                parentScopeData.children.push(threwData)
                scopePath.push(threwData)
                return
            }
            const biggerScope = Math.max(snapshot.stack.length, scopePath.length)
            ;[...Array(biggerScope).keys()].forEach(j => {
                const scope = snapshot.stack[j]
                const scopeData = scopePath[j]
                if (!scope && !scopeData) return
                else if (!scopeData) {
                    const newScopeData: ScopeData = { name: scope.name, start: i, size: 0, children: [], threw: false }
                    const parentScopeData = scopePath[j - 1]
                    parentScopeData.children.push(newScopeData)
                    scopePath.push(newScopeData)
                } else if (!scope) {
                    scopePath.splice(j)
                } else if (scope.name !== scopeData.name) {
                    const newScopeData: ScopeData = { name: scope.name, start: i, size: 0, children: [], threw: false }
                    const parentScopeData = scopePath[j - 1]
                    parentScopeData.children.push(newScopeData)
                    scopePath.pop()
                    scopePath.push(newScopeData)
                }
            })
            scopePath.forEach(scopeData => scopeData.size++)
        })
        return rootData
    }, [steps])

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (ref.current.clientWidth === width) return
            setWidth(ref.current.clientWidth)
        }, 1000)

        return () => clearInterval(interval)
    }, [ref, width])

    return (
        <div ref={ref} className={classes.container}>
            {steps && <ScopeTrace scope={stackData} width={width} />}
        </div>
    )
})
