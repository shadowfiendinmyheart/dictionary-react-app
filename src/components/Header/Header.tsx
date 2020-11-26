import React from 'react';

import styles from './Header.module.scss'

const Header = ():React.ReactElement => {
  return (
    <header>
      <div className={styles.logo}>
        <img></img>
      </div>
      <nav className={styles.navigation}>
        <ul className={styles.list}>
          <li className={styles.elem}>
            <a className={styles.button}>
              home
            </a>
          </li>
          <li className={styles.elem}>
            <a className={styles.button}>
              dictionary
            </a>
          </li>
          <li className={styles.elem}>
            <a className={styles.button}>
              learn !
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
};

export default Header;