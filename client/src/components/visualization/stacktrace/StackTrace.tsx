import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import { useSelection } from '../../../reducers/Store'
import { ScopeTrace } from './ScopeTrace'

export type ScopeData = { name: string; children: ScopeData[]; range: [number, number] }

const classes = {
    container: cn('d-flex align-items-start flex-nowrap', 'overflow-auto', 'w-100 h-100', css({ userSelect: 'none' }))
}

export const StackTrace = React.memo(() => {
    const ref = React.useRef<HTMLDivElement>()
    const [width, setWidth] = React.useState(0)
    const { tracer } = useSelection(state => ({ tracer: state.tracer }))

    const stackRootData = React.useMemo(() => {
        if (!tracer.available) return
        const stackRootData: ScopeData = { name: undefined, children: [], range: [0, 0] }
        const scopeDataPath: ScopeData[] = []
        tracer.steps.forEach(({ snapshot, threw }, i) => {
            if (threw) {
                const name = threw.exception?.type ?? threw.cause
                const threwScopeData: ScopeData = { name, range: [i, i], children: [] }
                stackRootData.children.push(threwScopeData)
                scopeDataPath.splice(0, Infinity, threwScopeData)
                return
            }
            ;[...Array(Math.max(snapshot.stack.length, scopeDataPath.length)).keys()].forEach(j => {
                const scope = snapshot.stack[j]
                const scopeData = scopeDataPath[j]
                if (!scope && !scopeData) return
                else if (!scopeData) {
                    const newScopeData: ScopeData = { name: scope.name, range: [i, i], children: [] }
                    const parentScopeData = scopeDataPath[j - 1]
                    ;(parentScopeData?.children ?? stackRootData.children).push(newScopeData)
                    scopeDataPath.push(newScopeData)
                    scopeDataPath.forEach(scopeData => (scopeData.range[1] = i))
                } else if (!scope) {
                    scopeDataPath.splice(j)
                } else if (scope.name !== scopeData.name) {
                    const newScopeData: ScopeData = { name, range: [i, i], children: [] }
                    const parentScopeData = scopeDataPath[j - 1]
                    ;(parentScopeData?.children ?? stackRootData.children).push(newScopeData)
                    scopeDataPath.pop()
                    scopeDataPath.push(newScopeData)
                    scopeDataPath.forEach(scopeData => (scopeData.range[1] = i))
                }
            })
        })
        return stackRootData
    }, [tracer.available])

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (ref.current.clientWidth === width) return
            setWidth(ref.current.clientWidth)
        }, 1000)

        return () => clearInterval(interval)
    }, [ref, width])

    return (
        <div ref={ref} className={classes.container}>
            {tracer.available && <ScopeTrace scope={stackRootData} depth={-1} width={width} />}
        </div>
    )
})
