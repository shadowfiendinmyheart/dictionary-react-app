import React, { useState } from 'react';
import { useHttp } from '../../hooks/http.hook';
import InputForm from '../../components/InputForm';
import Button from '../../components/Button';

import styles from './AddWordPage.module.scss';

const AddWordPage = ():React.ReactElement => {
  const [word, setWord] = useState('');
  const [translate, setTranslate] = useState('');
  const { loading, request, answer, clearAnswer } = useHttp();

  const translateHandler = async (ev: React.SyntheticEvent) => {
    try {
      ev.preventDefault();
      ev.stopPropagation();
      const translateFromServer = await request(`words/translate?word=${word}`, 'GET');
      setTranslate(translateFromServer.message);
      
    } catch (e) {
      alert(e);
      console.log('ERROR: ', e);
    }
  }
  
  const onWordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWord(event.target.value);
  }
  
  const emptyHandler = () => {};

  return (
    <div className={styles.wrapper}>
      <form className={styles.add}>
        <InputForm type={'text'} name={'word'} onChange={onWordHandler} placeholder={'Введите слово для перевода'} />
        <InputForm type={'text'} name={'translate'} onChange={emptyHandler} placeholder={translate} />
        <Button onClick={translateHandler} text={'Перевести'} />
        <Button onClick={emptyHandler} text={'Добавить в словарь'} />
      </form>
    </div>
  )
}

export default AddWordPage;