import React from 'react';

import UserProfile from './components/userProfile';
import HomeButton from './components/homeButton';

import styles from './HomePage.module.scss';
import { ROUTES } from '../../constants/routes';

const HomePage = (): React.ReactElement => {
  return (
    <div className={styles.container}>
      <UserProfile />
      <div className={styles.menu}>
        <HomeButton classNameGrid={styles.addWordButton} text={"Добавить слово в словарик"} to={ROUTES.ADD_WORD_PAGE}/>
        <HomeButton classNameGrid={styles.gameOneButton} text={"Игра 1. Переводчик-pro"} to={"#"}/>
        <HomeButton classNameGrid={styles.gameTwoButton} text={"Игра 2. Переводчик-ez"} to={"#"}/>
        <HomeButton classNameGrid={styles.gameThreeButton} text={"Игра 3. Картинки"} to={"#"}/>
        <HomeButton classNameGrid={styles.showDictionaryButton} text={"Подсмотреть в словарик"} to={ROUTES.DICTIONARY_PAGE}/>
      </div>
    </div>
  )
};

export default HomePage;