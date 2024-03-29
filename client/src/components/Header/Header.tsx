import React from 'react';
import { observer } from 'mobx-react-lite';
import { toast } from 'react-toastify';

import { useHttp } from '../../hooks/http.hook';
import Link from '../Link';
import { ROUTES } from '../../constants/routes';
import { notificationConfig } from '../../constants/notification';
import user from '../../store/user';

import styles from './Header.module.scss';

const Header = observer(():React.ReactElement => {
  const { loading, request } = useHttp();

  const logoutHandler = async () => {
    if (loading) return;

    try {
      await request('api/auth/logout', 'POST', null, {Authorization: `Bearer ${user.token}`});
      user.logout();
      toast.success('Вы вышли из аккаунта', notificationConfig);
    } catch(e) {
      console.log('error', e);
      toast.error(String(e), notificationConfig);
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