import { css } from 'emotion'
import React from 'react'
import { actions, useDispatch, useSelection } from '../../reducers/Store'

const classes = {
    container: 'input-group w-auto',
    group: 'input-group-prepend',
    label: `input-group-text justify-content-center ${css({ width: '6.5rem' })}`,
    select: `custom-select ${css({ flex: '0 1 auto !important', width: '6rem !important' })}`,
    spinner: 'spinner-border spinner-border-sm text-secondary'
}

export const Language = () => {
    const dispatch = useDispatch()
    const { language } = useSelection(state => ({ language: state.language }))
    const selected = language.languages[language.selected]

    return (
        <div className={classes.container} title='Pick a language'>
            <div className={classes.group}>
                <span className={classes.label}>
                    <span className={language.fetching ? classes.spinner : ''}>{language.fetching || 'Language'}</span>
                </span>
            </div>
            <select
                className={classes.select}
                value={selected}
                onChange={event => dispatch(actions.language.select(event.target.selectedIndex))}
            >
                {language.languages.map(language => (
                    <option key={language}>{language}</option>
                ))}
            </select>
        </div>
    )
}
