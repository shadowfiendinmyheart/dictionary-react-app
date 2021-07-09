import React, { useContext } from 'react';

import styles from './UserProfile.module.scss';

const UserProfile = (): React.ReactElement => {
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.profile}>
        <div className={styles.info}>
          <h2 className={styles.username}>USERNAME</h2>
          <div className={styles.stats}>
            <ul className={styles.list}>
              <li className={styles.element}>
                <span>Кол-во слов в словаре: </span>
                <span>12566</span>
              </li>
              <li className={styles.element}>
                <span>Кол-во изученных слов: </span>
                <span>7667</span>
              </li>
              <li className={styles.element}>
                <span>Кол-во слов для изучения:</span>
                <span>4899</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;