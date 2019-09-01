import cn from 'classnames'
import { css } from 'emotion'
import * as React from 'react'
import playImg from '../../public/buttons/play.png'
import stepImg from '../../public/buttons/stepInto.png'
import { colors } from '../colors'
import { actions as programActions } from '../reducers/program'
import { useDispatch, useRedux } from '../reducers/Store'
import { actions as tracerActions } from '../reducers/tracer'

const classes = {
    container: cn('d-flex align-items-center', 'shadow-sm'),
    image: cn('m-3', css({ height: '1.5rem', width: '1.5rem' })),
    form: cn('d-flex', 'input-group', 'w-auto ml-3'),
    languages: cn('input-group-prepend'),
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

const styles = {
    image: (available: boolean, rotation: number = 0) => ({
        transform: `rotate(${rotation}deg)`,
        ...(available ? { cursor: 'pointer' } : { filter: 'grayscale(100%)' })
    })
}

export const Controls = () => {
    const dispatch = useDispatch()
    const { language, languages, fetching, tracer } = useRedux(state => ({
        language: state.program.language,
        languages: state.program.languages,
        fetching: state.program.fetching,
        tracer: state.tracer
    }))

    React.useEffect(() => {
        dispatch(programActions.fetchLanguages())
    }, [])

    return (
        <div className={classes.container}>
            <div className={classes.form}>
                <div className={classes.languages}>
                    <button className={classes.button}>
                        <span className={classes.label}>Language</span>
                        {fetching && <span className={classes.spin} />}
                    </button>
                </div>
                <select
                    className={classes.select}
                    disabled={tracer.fetching}
                    defaultValue={language}
                    onChange={event => dispatch(programActions.setLanguage(languages[event.target.selectedIndex]))}
                >
                    {languages.length === 0 && <option key={-1} label={fetching ? '...' : '!'} />}
                    {languages.map((language, i) => (
                        <option key={i} value={language} label={language} />
                    ))}
                </select>
            </div>
            <img
                className={classes.image}
                style={styles.image(!tracer.fetching)}
                src={playImg}
                title={'trace'}
                onClick={() => dispatch(tracerActions.trace())}
            />
            <img
                className={classes.image}
                style={styles.image(tracer.available && tracer.index > 0, 90)}
                src={stepImg}
                title='step back'
                onClick={() => dispatch(tracerActions.setIndex(tracer.index - 1))}
            />
            <img
                className={classes.image}
                style={styles.image(tracer.available && tracer.index < tracer.steps.length - 1, -90)}
                src={stepImg}
                title='step forward'
                onClick={() => dispatch(tracerActions.setIndex(tracer.index + 1))}
            />
        </div>
    )
}
