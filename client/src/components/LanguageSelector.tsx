import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { actions as languageActions } from '../reducers/language'
import { useDispatch, useRedux } from '../reducers/Store'

const classes = {
    container: 'd-flex input-group w-auto ml-3',
    reloader: {
        container: 'input-group-prepend',
        label: 'flex-fill',
        spin: 'spinner-grow spinner-grow-sm',
        button: cn('d-inline-flex align-items-center btn btn-outline-secondary', css({ width: '8rem' }))
    },
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
        <div className={classes.container}>
            <div
                className={classes.reloader.container}
                onClick={() => dispatch(languageActions.fetch())}
                onMouseEnter={() => setMouseOver(true)}
                onMouseLeave={() => setMouseOver(false)}
            >
                <button className={classes.reloader.button}>
                    <span className={classes.reloader.label}>
                        {!language.fetching ? (!mouseOver ? 'Language' : 'Reload') : 'Loading'}
                    </span>
                    {language.fetching && <span className={classes.reloader.spin} />}
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
