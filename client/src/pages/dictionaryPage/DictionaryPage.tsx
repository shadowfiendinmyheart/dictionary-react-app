import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { toast } from 'react-toastify';

import user from '../../store/user';
import { notificationConfig } from '../../constants/notification';
import InputForm from '../../components/InputForm';
import Button from '../../components/Button';
import UserCards from './components/UserCards';

import { useHttp } from '../../hooks/http.hook';

import styles from './DictionaryPage.module.scss';

export enum words {
  all,
  known,
  unknown
}

export interface card {
  word: string, 
  translations: string[], 
  imageURL: string,
  counter: number
}

const DictionaryPage = observer((): React.ReactElement => {
  const { request, loading } = useHttp();

  const [selectedWords, setSelectedWords] = useState<words>(words.all);
  const [searchWord, setSearchWord] = useState<string>('');
  const [cards, setCards] = useState<card[]>([]);
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(2);

  const handleSelectChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWords(Number(ev.target.value));
  }

  const getCards = (page: number) => {
    return request(
      `words/getWordsList?page=${page}&filter=${selectedWords}`,
      'GET',
      null,
      {Authorization: `Bearer ${user.token}`}
    );
  }

  const scrollPageHandler = (): Promise<void | string> => {
    return new Promise((res, rej) => {
      const nextPage: Promise<void | string> = getCards(page)
        .then((res: any) => {
          setCards([...cards, ...res.words]);
          setPage(prev => prev + 1);
          setMaxPage(res.pagesTotal);
        })
        .catch((rej) => `got error - ${rej}`);

      res(nextPage);
      rej(nextPage);
    })
  }

  const findCardHandler = async (ev: React.SyntheticEvent) => {
    ev.stopPropagation();
    ev.preventDefault();

    
    try {
      if (searchWord.trim() === '') {
        setPage(2);
        const cards = await getCards(1);
        setCards(cards.words);
        return;
      }
      
      const cards = await request(
        `words/getEngWord?reqWord=${searchWord}`,
        'GET',
        null,
        {Authorization: `Bearer ${user.token}`}
      );

      if (cards.message.length === 0) {
        throw new Error('К сожалению, у тебя нет такого слова :(');
      }
        
      setCards([{...cards.message}]);
    } catch(e) {
      toast.error(String(e), notificationConfig);
      console.log('here', e);
    }
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
        <Button onClick={findCardHandler} text={'Мне повезёт'} />
      </form>
      <UserCards
        cards={cards} 
        page={page} 
        maxPage={maxPage} 
        selectedWords={selectedWords}
        onScrollPage={scrollPageHandler}
      />
    </div>
  )
});

export default DictionaryPage;