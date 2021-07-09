import React from 'react';

import UserProfile from './components/userProfile';
import LinkAsButton from '../../components/LinkAsButton';

import styles from './HomePage.module.scss';
import { ROUTES } from '../../constants/routes';

const HomePage = (): React.ReactElement => {
  return (
    <div className={styles.container}>
      <UserProfile />
      <div className={styles.menu}>
        <LinkAsButton classNameGrid={styles.addWordButton} text={"Добавить слово в словарик"} to={ROUTES.ADD_WORD_PAGE}/>
        <LinkAsButton classNameGrid={styles.gameOneButton} text={"Игра 1. Переводчик-pro"} to={"#"}/>
        <LinkAsButton classNameGrid={styles.gameTwoButton} text={"Игра 2. Переводчик-ez"} to={"#"}/>
        <LinkAsButton classNameGrid={styles.gameThreeButton} text={"Игра 3. Картинки"} to={"#"}/>
        <LinkAsButton classNameGrid={styles.showDictionaryButton} text={"Подсмотреть в словарик"} to={ROUTES.DICTIONARY_PAGE}/>
      </div>
    </div>
  )
};

export default HomePage;