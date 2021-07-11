import React, { useState, useContext, useEffect } from 'react';
import Card from '../../components/Card';
import InputForm from '../../components/InputForm';
import Button from '../../components/Button';

import { useHttp } from '../../hooks/http.hook';
import AuthContext from '../../context/AuthContext';

import styles from './DictionaryPage.module.scss';

enum words {
  all,
  known,
  unknown
}

const DictionaryPage = (): React.ReactElement => {
  const auth = useContext(AuthContext);
  const { request, loading } = useHttp();

  const [selectedWords, setSelectedWords] = useState<words>(words.all);
  const [searchWord, setSearchWord] = useState<string>('');
  const [cards, setCards] = useState<[]>([]);

  const handleSelectChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWords(Number(ev.target.value));
  }

  useEffect(() => {
    const getCards = async () => {
      try {
        const userInfo = await request(
          `user/info`,
          'GET',
          null, 
          {Authorization: `Bearer ${auth.token}`}
        );

        setCards(userInfo.message.words);
      } catch (e) {
        console.log('ERROR:', e);
      }
    }

    getCards();

    return () => {
      setCards([]);
    }
  }, []);

  const cardsElem = (cards: any[]) => {
      return cards.map(card => 
        <div className={styles.card} key={card.word}>
          <Card 
                word={card.word}  
                translate={card.word} 
                url={card.imageURL}
                size={'s'}
              />
        </div>
      ) 
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.formWrapper}>
        <select className={styles.selectWord} onChange={handleSelectChange}>
          <option value={words.all}>Все слова</option>
          <option value={words.known}>Выученные слова</option>
          <option value={words.unknown}>Невыученные слова</option>
        </select>
        <InputForm 
          name='search' 
          placeholder='Введите слово для поиска' 
          type='text'
          value={searchWord}
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setSearchWord(ev.target.value)}
        />
        <Button onClick={() => console.log('mock')} text={'Мне повезёт'} />
      </form>

      <div className={styles.cardsWrapper}>
        {cardsElem(cards)}
      </div>
    </div>
  )
}

export default DictionaryPage;