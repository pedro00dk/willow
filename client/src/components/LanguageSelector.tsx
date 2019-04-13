import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { actions as languageActions } from '../reducers/language'
import { useDispatch, useRedux } from '../reducers/Store'

const classes = {
    button: cn('d-inline-flex align-items-center btn btn-outline-secondary', css({ width: '8rem' })),
    select: cn('custom-select', css({ flex: '0 1 auto !important', width: '8rem !important' }))
}

export function LanguageSelector() {
    const [mouseOver, setMouseOver] = React.useState(false)
    const dispatch = useDispatch()
    const { debugInterface, language } = useRedux(state => ({
        debugInterface: state.debugInterface,
        language: state.language
    }))

    React.useEffect(() => {
        dispatch(languageActions.fetch())
    }, [])

    return (
        <div className='d-flex input-group w-auto ml-3'>
            <div
                className='input-group-prepend'
                onClick={() => dispatch(languageActions.fetch())}
                onMouseEnter={() => setMouseOver(true)}
                onMouseLeave={() => setMouseOver(false)}
            >
                <button className={classes.button}>
                    <span className='flex-fill'>
                        {!language.fetching ? (!mouseOver ? 'Language' : 'Reload') : 'Loading'}
                    </span>
                    {language.fetching && <span className='spinner-grow spinner-grow-sm' />}
                </button>
            </div>
            <select
                className={classes.select}
                disabled={debugInterface.fetching}
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
