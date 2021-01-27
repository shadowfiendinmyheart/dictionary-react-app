import React from 'react';

import styles from './UserProfile.module.scss'

const UserProfile = (): React.ReactElement => {
  return (
    <div className={styles.profile}>
      <div className={styles.wrapperAvatar}>
        <img className={styles.avatar} alt={'avatar'} />
      </div>
      <div className={styles.info}>
        <h2 className={styles.username}>USERNAME</h2>
        <div className={styles.stats}>
          <ul className={styles.list}>
            <li className={styles.element}>
              <span>Кол-во слов в словаре:</span>
            </li>
            <li className={styles.element}>
              <span>Кол-во изученных слов:</span>
            </li>
            <li className={styles.element}>
              <span>Кол-во слов для изучения:</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;