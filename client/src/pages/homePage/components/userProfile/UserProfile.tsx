import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useHttp } from '../../../../hooks/http.hook';
import user from '../../../../store/user';

import styles from './UserProfile.module.scss';

const UserProfile = observer((): React.ReactElement => {
  const { request, loading } = useHttp();
  
  const [username, setUsername] = useState<string>();
  const [allWords, setAllWords] = useState<number>(0);
  const [knownWords, setKnownWords] = useState<number>(0);

  useEffect(() => {
    const setUserInfo = async () => {
      try {
        const userInfo = await request(
          `user/info`,
          'GET',
          null, 
          {Authorization: `Bearer ${user.token}`}
        );
        
        setUsername(userInfo.message.nickname);
        if (userInfo.message.words) {
          setAllWords(userInfo.message.words.length);
          setKnownWords(userInfo.message.words.length);
        }
      } catch (e) {
        console.log('ERROR:', e);
      }
    }
    setUserInfo();
  }, [])

  // TODO: сделать loader для текста
  return (
    <div className={styles.wrapper}>
      <div className={styles.profile}>
        <div className={styles.info}>
          <h2 className={styles.username}>Добро пожаловать, {loading ? 'loading' : username}</h2>
          <div className={styles.stats}>
            <ul className={styles.list}>
              <li className={styles.element}>
                <span>Кол-во слов в словаре: </span>
                <span>{allWords}</span>
              </li>
              <li className={styles.element}>
                <span>Кол-во изученных слов: </span>
                <span>{loading ? 'loading' : knownWords}</span>
              </li>
              <li className={styles.element}>
                <span>Кол-во слов для изучения: </span>
                <span>{loading ? 'loading' : (allWords - knownWords)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

export default UserProfile;