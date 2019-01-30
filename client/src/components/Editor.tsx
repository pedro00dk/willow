import * as ace from 'brace'
import * as React from 'react'


export function Editor() {
    const divRef = React.useRef(undefined)
    const [editor, setEditor] = React.useState<ace.Editor>(undefined)
    React.useEffect(
        () => divRef.current ? setEditor(ace.edit(divRef.current)) : undefined,
        [divRef]
    )

    return <div ref={divRef} className='w-100 h-100' />
}
