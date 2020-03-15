import { css } from 'emotion'
import React from 'react'
import { actions as languageActions } from '../../reducers/language'
import { useDispatch, useSelection } from '../../reducers/Store'

const classes = {
    container: 'input-group w-auto',
    group: 'input-group-prepend',
    label: 'input-group-text',
    select: `custom-select ${css({ flex: '0 1 auto !important', width: '6rem !important' })}`
}

export const Language = () => {
    const dispatch = useDispatch()
    const { languages, selected } = useSelection(state => ({
        languages: state.language.languages,
        selected: state.language.languages[state.language.selected]
    }))

    React.useEffect(() => {
        dispatch(languageActions.fetch())
    }, [])

    return (
        <div className={classes.container} title='Pick a language'>
            <div className={classes.group}>
                <span className={classes.label}>{'Language'}</span>
            </div>
            <select
                className={classes.select}
                defaultValue={selected}
                onChange={event => dispatch(languageActions.select(event.target.selectedIndex))}
            >
                {languages.map(language => (
                    <option key={language}>{language}</option>
                ))}
            </select>
        </div>
    )
}
