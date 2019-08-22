import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../colors'
import { actions as programActions } from '../reducers/program'
import { useDispatch, useRedux } from '../reducers/Store'

const classes = {
    container: cn('d-flex', 'input-group', 'w-auto ml-3'),
    reloader: cn('input-group-prepend'),
    label: cn('flex-fill'),
    spin: cn('spinner-grow spinner-grow-sm'),
    button: cn(
        'd-inline-flex align-items-center',
        'btn',
        'p-1',
        css({
            background: colors.gray.light,
            border: `1px solid ${colors.gray.dark}`,
            color: colors.black,
            fontSize: '1rem',
            width: '7rem',
            ':hover': { background: colors.gray.main }
        })
    ),
    select: cn('custom-select', css({ flex: '0 1 auto !important', color: colors.black, width: '6rem !important' }))
}

export function Languages() {
    const [mouseOver, setMouseOver] = React.useState(false)
    const dispatch = useDispatch()
    const { language, languages, fetching, tracerFetching } = useRedux(state => ({
        language: state.program.language,
        languages: state.program.languages,
        fetching: state.program.fetching,
        tracerFetching: state.tracer.fetching
    }))

    React.useEffect(() => {
        dispatch(programActions.fetchLanguages())
    }, [])

    return (
        <div className={classes.container}>
            <div
                className={classes.reloader}
                onClick={() => dispatch(programActions.fetchLanguages())}
                onMouseEnter={() => setMouseOver(true)}
                onMouseLeave={() => setMouseOver(false)}
            >
                <button className={classes.button}>
                    <span className={classes.label}>
                        {!fetching ? (!mouseOver ? 'Language' : 'Reload') : 'Loading'}
                    </span>
                    {fetching && <span className={classes.spin} />}
                </button>
            </div>
            <select
                className={classes.select}
                disabled={tracerFetching}
                defaultValue={language}
                onChange={event => dispatch(programActions.setLanguage(languages[event.target.selectedIndex]))}
            >
                {!!languages && languages.length === 0 && <option key={-1} label={fetching ? '...' : '!'} />}
                {!!languages && languages.map((language, i) => <option key={i} value={language} label={language} />)}
            </select>
        </div>
    )
}
