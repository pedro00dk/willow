import cn from 'classnames'
import { css } from 'emotion'
import React from 'react'
import { actions as languageActions } from '../../reducers/language'
import { useDispatch, useSelection } from '../../reducers/Store'

const classes = {
    container: 'input-group w-auto',
    group: 'input-group-prepend',
    label: 'input-group-text',
    select: cn('custom-select', css({ flex: '0 1 auto !important', width: '6rem !important' }))
}

export const Language = () => {
    const dispatch = useDispatch()
    const { language } = useSelection(state => ({ language: state.language }))
    const fetching = language.fetching
    const languages = language.languages
    const selectedLanguage = language.languages[language.selected]

    React.useEffect(() => void dispatch(languageActions.fetch()), [])

    return (
        <div className={classes.container} title='Pick a language'>
            <div className={classes.group}>
                <span className={classes.label}>Language</span>
            </div>
            <select
                className={classes.select}
                defaultValue={selectedLanguage}
                onChange={event => dispatch(languageActions.select(event.target.selectedIndex))}
            >
                {languages.length === 0 && <option key={-1}>{fetching ? '...' : '!!!'}</option>}
                {languages.map((language, i) => (
                    <option key={i}>{language}</option>
                ))}
            </select>
        </div>
    )
}
