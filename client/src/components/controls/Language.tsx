import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import { colors } from '../../colors'
import { actions as languageActions } from '../../reducers/language'
import { useDispatch, useSelection } from '../../reducers/Store'

const classes = {
    container: 'd-flex input-group w-auto',
    input: 'input-group-prepend',
    button: cn(
        'd-inline-flex align-items-center btn p-1',
        css({
            background: colors.gray.light,
            border: `1px solid ${colors.gray.dark}`,
            color: colors.black,
            fontSize: '1rem',
            width: '7rem',
            ':hover': { background: colors.gray.main }
        })
    ),
    label: 'flex-fill',
    spin: 'spinner-grow spinner-grow-sm',
    select: cn('custom-select', css({ flex: '0 1 auto !important', color: colors.black, width: '6rem !important' }))
}

export const Language = () => {
    const dispatch = useDispatch()
    const { fetching, languages, selected, tracerFetching } = useSelection(state => ({
        fetching: state.language.fetching,
        languages: state.language.languages,
        selected: state.language.languages[state.language.selected],
        tracerFetching: state.tracer.fetching
    }))

    React.useEffect(() => void dispatch(languageActions.fetch()), [])

    return (
        <div className={classes.container}>
            <div className={classes.input}>
                <button className={classes.button}>
                    <span className={classes.label}>Language</span>
                    {fetching && <span className={classes.spin} />}
                </button>
            </div>
            <select
                className={classes.select}
                disabled={tracerFetching}
                defaultValue={selected}
                onChange={event => dispatch(languageActions.select(event.target.selectedIndex))}
            >
                {languages.length === 0 && <option key={-1} label={fetching ? '...' : '!'} />}
                {languages.map((language, i) => (
                    <option key={i} value={language} label={language} />
                ))}
            </select>
        </div>
    )
}
