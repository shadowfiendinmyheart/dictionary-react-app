import React, { useState, useContext, useEffect } from 'react';
import Card from '../../components/Card';
import { sizeVariant } from '../../components/Card/Card';
import InputForm from '../../components/InputForm';
import Button from '../../components/Button';
import DynamicPagination from '../../components/DynamicPagination';

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
  const [cards, setCards] = useState<{word: string, translations: string[], imageURL: string}[]>([]);
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(2);

  const handleSelectChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWords(Number(ev.target.value));
  }

  const getCards = async () => {
    try {
      const cards = await request(
        `words/getWordsList?page=${page}`,
        'GET',
        null,
        {Authorization: `Bearer ${auth.token}`}
      );
      console.log('cards', cards);
      setCards(cards.words);
    } catch (e) {
      console.log('ERROR:', e);
    }
  }

  useEffect(() => {
    getCards();
  }, [selectedWords]);

  const cardsElem = (cards: {word: string, translations: string[], imageURL: string}[]) => {
      return cards.map(card => 
        <div className={styles.card} key={card.word}>
          <Card 
                word={card.word}  
                translate={card.translations[0]} 
                url={card.imageURL}
                size={sizeVariant.s}
              />
        </div>
      ) 
  }

  const dynamicPaginationHandler = (): Promise<void | string> => {
    return new Promise((res, rej) => {
      const nextPage: Promise<void | string> = getCards()
        .then((res: any) => {
            setCards([...cards, ...res]);
            setPage(prev => prev + 1);
        })
        .catch((rej) => `got error - ${rej}`);

      res(nextPage);
      rej(nextPage);
    })
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
        <DynamicPagination currentPage={page} maxPage={maxPage} onScrollEnd={dynamicPaginationHandler}>
          {cardsElem(cards)}
        </DynamicPagination>
      </div>
    </div>
  )
}

export default DictionaryPage;