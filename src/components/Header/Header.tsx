import React from 'react';
import HeaderButton from './components/headerButton'

import styles from './Header.module.scss'

const Header = ():React.ReactElement => {
  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <img className={styles.logoImage} alt={'header logo'} src={"https://sun9-25.userapi.com/impg/XagdCiW8RstmiboFExKPs1wfyGbN-opksBLyew/SHwH5Y_8iHc.jpg?size=1000x1000&quality=96&proxy=1&sign=cd82d7adff999ebb4cb88c25bb802b1d"}></img>
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