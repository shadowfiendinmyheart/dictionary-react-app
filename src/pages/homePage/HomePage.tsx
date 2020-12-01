import React from 'react';

import UserProfile from './components/userProfile';
import HomeButton from './components/homeButton';

import styles from './HomePage.module.scss';

const HomePage = (): React.ReactElement => {
  return (
    <div className={styles.container}>
      <UserProfile />
      <div className={styles.menu}>
        <HomeButton />
      </div>
    </div>
  )
};

export default HomePage;