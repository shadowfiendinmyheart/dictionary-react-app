import React, { useContext } from 'react';

import Link from '../Link';
import AuthContext from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';

import styles from './Header.module.scss';

type headerProps = {
  isAuth: boolean
}

const Header = ( props: headerProps ):React.ReactElement => {
  const { isAuth } = props;

  const { logout } = useContext(AuthContext);

  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <img className={styles.logoImage} alt={'header logo'} src={"https://freepngimg.com/thumb/book/37064-8-book-hd.png"}></img>
      </div>
      {isAuth && (
        <nav className={styles.navigation}>
          <ul className={styles.list}>
            <li className={styles.elem}>
              <Link href={ROUTES.HOME_PAGE} text="Домой" />
            </li>
            <li className={styles.elem}>
              <Link href="#" text="Выйти" onClick={logout} />
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
};

export default Header;