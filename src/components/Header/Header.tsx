import React from 'react';
import { NavLink } from 'react-router-dom'
import HeaderButton from './components/headerButton'

import styles from './Header.module.scss'

const Header = ():React.ReactElement => {
  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <img></img>
      </div>
      <nav className={styles.navigation}>
        <ul className={styles.list}>
          <li className={styles.elem}>
            <HeaderButton href="/21453647566" text="home" />
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