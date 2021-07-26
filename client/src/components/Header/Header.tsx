import React from 'react';
import { observer } from 'mobx-react-lite';
import { useHttp } from '../../hooks/http.hook';

import Link from '../Link';
import { ROUTES } from '../../constants/routes';
import user from '../../store/user';

import styles from './Header.module.scss';

const Header = observer(():React.ReactElement => {
  const { loading, request } = useHttp();

  const logoutHandler = async () => {
    if (loading) return;

    try {
      const data = await request('api/auth/logout', 'POST', null, {Authorization: `Bearer ${user.token}`});
      console.log('logout', data);
      user.logout();
    } catch(e) {
      console.log('error', e);
    }
  }

  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <img className={styles.logoImage} alt={'header logo'} src={"https://freepngimg.com/thumb/book/37064-8-book-hd.png"}></img>
      </div>
      {user.isAuth && (
        <nav className={styles.navigation}>
          <ul className={styles.list}>
            <li className={styles.elem}>
              <Link href={ROUTES.HOME_PAGE} text="Домой" />
            </li>
            <li className={styles.elem}>
              <Link href={ROUTES.WELCOME_PAGE} text="Выйти" onClick={logoutHandler} />
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
});

export default Header;