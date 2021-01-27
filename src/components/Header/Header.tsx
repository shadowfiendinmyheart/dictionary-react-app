import React from 'react';
import HeaderButton from './components/headerButton'

import styles from './Header.module.scss'

const Header = ():React.ReactElement => {
  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <img className={styles.logoImage} alt={'header logo'} src={"https://freepngimg.com/thumb/book/37064-8-book-hd.png"}></img>
      </div>
      <nav className={styles.navigation}>
        <ul className={styles.list}>
          <li className={styles.elem}>
            <HeaderButton href="/home" text="home" />
          </li>
          <li className={styles.elem}>
            <HeaderButton href="/" text="dictionary" />
          </li>
          <li className={styles.elem}>
            <HeaderButton href="/" text="learn" />
          </li>
        </ul>
      </nav>
    </header>
  )
};

export default Header;