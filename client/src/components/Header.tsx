import { css } from 'emotion'
import React from 'react'
import logo from '../../public/logo.svg'
import { actions, useDispatch, useSelection } from '../reducers/Store'

const classes = {
    container: 'navbar navbar-light bg-light shadow-sm',
    brand: {
        container: 'd-flex navbar-brand align-items-center',
        logo: `mr-2 ${css({ filter: 'invert(1)', width: '2rem' })}`
    },
    menu: {
        left: 'navbar-nav flex-row',
        right: 'navbar-nav flex-row ml-auto',
        item: 'nav-item active px-2',
        text: `navbar-text ${css({cursor: 'default'})}`,
        link: 'nav-link'
    },
    spinner: 'spinner-border spinner-border-sm text-secondary'
}

export const Header = () => {
    const dispatch = useDispatch()

    React.useEffect(() => {
        ;(async () => {
            await Promise.all([dispatch(actions.user.fetch()), dispatch(actions.language.fetch())])
            await dispatch(actions.storage.storage())
        })()
    })

    return (
        <header className={classes.container}>
            <Brand />
            <ul className={classes.menu.left}>
                <li className={classes.menu.item}>
                    <Help />
                </li>
            </ul>
            <ul className={classes.menu.right}>
                <li className={classes.menu.item}>
                    <User />
                </li>
                <li className={classes.menu.item}>
                    <SignInOut />
                </li>
            </ul>
        </header>
    )
}

const Brand = () => (
    <a className={classes.brand.container} href='#'>
        <img className={classes.brand.logo} src={logo} />
        <span>{'Willow'}</span>
    </a>
)

const Help = () => {
    const helpUrl = 'https://github.com/pedro00dk/willow/blob/master/docs/HOW_TO_USE.md'

    return (
        <a className={classes.menu.link} href={helpUrl} target='_blank'>
            {'How to use'}
        </a>
    )
}

const User = () => {
    const { user } = useSelection(state => ({ user: state.user }))

    return (
        <span className={classes.menu.text}>
            <span className={user.fetching ? classes.spinner : ''}>
                {!user.fetching && (user.user?.email ?? 'Sign in to execute bigger programs')}
            </span>
        </span>
    )
}

const SignInOut = () => {
    const dispatch = useDispatch()
    const { user } = useSelection(state => ({ user: state.user }))
    const action = user.user ? actions.user.signout() : actions.user.signin()
    const label = user.user ? 'Sign out' : 'Sign in'

    return (
        <a className={classes.menu.link} href='#' onClick={() => dispatch(action)}>
            {label}
        </a>
    )
}
