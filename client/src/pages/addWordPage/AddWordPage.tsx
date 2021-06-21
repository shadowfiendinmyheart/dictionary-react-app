import React, { useContext, useState } from 'react';
import { useHttp } from '../../hooks/http.hook';
import AuthContext from '../../context/AuthContext';
import InputForm from '../../components/InputForm';
import Button from '../../components/Button';

import styles from './AddWordPage.module.scss';

const AddWordPage = ():React.ReactElement => {
  const [word, setWord] = useState('');
  const [translate, setTranslate] = useState('');
  const { loading, request } = useHttp();
  const auth = useContext(AuthContext);

  // TODO: подумать над некой "обёрткой" для кнопок
  const translateHandler = async (ev: React.SyntheticEvent) => {
    if (!word) return console.log('Введите слово для перевода');
    try {
      ev.preventDefault();
      ev.stopPropagation();
      const translateFromServer = await request(`words/translate?word=${word}`, 'GET', null, {Authorization: `Bearer ${auth.token}`});
      setTranslate(translateFromServer.message);
    } catch (e) {
      console.log('ERROR: ', e);
    }
  }
  
  const onWordHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setWord(ev.target.value);
  }

  const onTranslateHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setTranslate(ev.target.value);
  }
  
  const addWordHandler = async (ev: React.SyntheticEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    // TODO: сделать вывод ошибки
    if (!word) return console.log('Введите слово для перевода');
    if (!translate) return console.log('Укажите перевод');
    
    try {
      const saveTranslateWord = await request(`words/saveTranslation`, 'POST', {reqWord: word, reqTranslation: translate}, {Authorization: `Bearer ${auth.token}`});
      console.log('done', saveTranslateWord);
    } catch (e) {
      console.log('ERROR: ', e);
    }
  };  

  return (
    <div className={styles.wrapper}>
      <form className={styles.wrapperForm}>
        <div className={styles.inpForm}>
          <InputForm  type={'text'} name={'word'} onChange={onWordHandler} placeholder={'Введите слово для перевода'} />
        </div>
        <Button onClick={translateHandler} text={'Перевести'} disabled={loading} />
        <div className={styles.inpForm}>
          <InputForm type={'text'} name={'translate'} onChange={onTranslateHandler} placeholder={'Перевод'} value={translate} />
        </div>
        <Button onClick={addWordHandler} text={'Добавить в словарь'} disabled={loading} />
      </form>
      <div>
      <div className={styles.wrapperPickImage}>
        see u later (WIP)
      </div>
      </div>
    </div>
  )
}

export default AddWordPage;