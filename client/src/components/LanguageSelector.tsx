import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { actions as languageActions } from '../reducers/language'
import { useDispatch, useRedux } from '../reducers/Store'

const styles = {
    group: cn('d-flex input-group ml-3', css({ width: 'auto' })),
    button: cn('d-inline-flex align-items-center btn btn-outline-secondary', css({ width: '8rem' })),
    select: cn('custom-select', css({ flex: '0 1 auto !important', width: '8rem !important' }))
}

export function LanguageSelector() {
    const [mouseOver, setMouseOver] = React.useState(false)
    const dispatch = useDispatch()
    const { debug, language } = useRedux(state => ({ debug: state.debug, language: state.language }))

    React.useEffect(() => {
        dispatch(languageActions.fetch())
    }, [])

    return (
        <div className={styles.group}>
            <div
                className='input-group-prepend'
                onClick={() => dispatch(languageActions.fetch())}
                onMouseEnter={() => setMouseOver(true)}
                onMouseLeave={() => setMouseOver(false)}
            >
                <button className={styles.button}>
                    <span className='flex-fill'>
                        {!language.fetching ? (!mouseOver ? 'Language' : 'Reload') : 'Loading'}
                    </span>
                    {language.fetching && <span className='spinner-grow spinner-grow-sm' />}
                </button>
            </div>
            <select
                className={styles.select}
                disabled={debug.debugging}
                defaultValue={language.languages[language.selected]}
                onChange={event => dispatch(languageActions.select(event.target.selectedIndex))}
            >
                {language.languages.map((language, i) => (
                    <option key={i} value={language} label={language} />
                ))}
                {language.languages.length === 0 && (
                    <option key={-1} value='text' label={language.fetching ? '...' : '!!!'} />
                )}
            </select>
        </div>
    )
}
