import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { actions as languageActions } from '../reducers/language'
import { useDispatch, useRedux } from '../reducers/Store'

const styles = {
    select: css({ flex: '0 1 auto !important', width: 'auto !important' }),
    input: css({ display: 'inline-flex !important', width: 'auto !important' })
}

export function LanguageSelector() {
    const dispatch = useDispatch()
    const { debug, language } = useRedux(state => ({ debug: state.debug, language: state.language }))

    React.useEffect(() => {
        dispatch(languageActions.fetch())
    }, [])

    return (
        <div className={cn('input-group ml-3', styles.input)}>
            <div className='input-group-prepend'>
                <label className='input-group-text'>Lang</label>
            </div>
            <select
                className={cn('custom-select', styles.select)}
                disabled={debug.debugging}
                defaultValue={language.languages[language.selected]}
                onChange={event => dispatch(languageActions.select(event.target.selectedIndex))}
            >
                {language.languages.map((language, i) => (
                    <option key={i} value={language}>
                        {language}
                    </option>
                ))}
                {language.languages.length === 0 ? (
                    language.fetching ? (
                        <option key={-1} value='text'>
                            ...
                        </option>
                    ) : (
                        <option key={-1} value='text'>
                            !!!
                        </option>
                    )
                ) : (
                    undefined
                )}
            </select>
        </div>
    )
}
