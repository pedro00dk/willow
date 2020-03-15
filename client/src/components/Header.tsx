import { css } from 'emotion'
import React from 'react'
import logo from '../../public/logo.svg'
import { useDispatch, useSelection } from '../reducers/Store'
import { actions as userActions } from '../reducers/user'

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
        text: 'navbar-text',
        link: 'nav-link'
    }
}

export const Header = () => (
    <header className={classes.container}>
        <Brand />
        <ul className={classes.menu.left}>
            <li className={classes.menu.item}>
                <Help />
            </li>
        </ul>
        <ul className={classes.menu.right}>
            <User />
            <li className={classes.menu.item}>
                <SignInOut />
            </li>
        </ul>
    </header>
)

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
    const dispatch = useDispatch()
    const { user } = useSelection(state => ({ user: state.user }))
    console.log(user)
    React.useEffect(() => {
        dispatch(userActions.fetch()).then(() => dispatch(userActions.fetchPrograms()))
    }, [])

    return <span className={classes.menu.text}>{user.fetching ? 'loading...' : user.user?.email ?? ''}</span>
}

const SignInOut = () => {
    const dispatch = useDispatch()
    const { user } = useSelection(state => ({ user: state.user }))
    const action = user.user ? userActions.signout() : userActions.signin()
    const label = `Sign ${user.user ? 'out' : 'in'}`
    return (
        <a className={classes.menu.link} href='#' onClick={() => dispatch(action)}>
            {label}
        </a>
    )
}
