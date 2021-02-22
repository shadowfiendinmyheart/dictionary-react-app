import React from 'react';
import Link from '../Link'

import styles from './Header.module.scss'

type headerProps = {
  isAuth: boolean
}

const Header = ( props: headerProps ):React.ReactElement => {
  const { isAuth } = props;

  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <img className={styles.logoImage} alt={'header logo'} src={"https://freepngimg.com/thumb/book/37064-8-book-hd.png"}></img>
      </div>
      {isAuth && (
        <nav className={styles.navigation}>
          <ul className={styles.list}>
            <li className={styles.elem}>
              <Link href="/home" text="home" />
            </li>
            <li className={styles.elem}>
              <Link href="/" text="dictionary" />
            </li>
            <li className={styles.elem}>
              <Link href="/" text="learn" />
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
};

export default Header;