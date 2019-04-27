import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import { colors } from '../colors'
import { actions as languageActions } from '../reducers/language'
import { useDispatch, useRedux } from '../reducers/Store'

const classes = {
    container: cn('d-flex', 'input-group', 'w-auto', 'ml-3'),
    reloader: {
        container: cn('input-group-prepend'),
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
                ':hover': {
                    background: colors.gray.main
                }
            })
        )
    },
    select: cn('custom-select', css({ flex: '0 1 auto !important', color: colors.black, width: '6rem !important' }))
}

export function LanguageSelector() {
    const [mouseOver, setMouseOver] = React.useState(false)
    const dispatch = useDispatch()
    const { language, tracerFetching } = useRedux(state => ({
        language: state.language,
        tracerFetching: state.tracer.fetching
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
                disabled={tracerFetching}
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
